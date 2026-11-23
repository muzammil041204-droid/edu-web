// Runs the edu-web migration + seed in PGlite (real Postgres in WASM) with
// stand-ins for Supabase's auth schema, roles, realtime publication and pg_cron,
// then checks the access rules as anon, a non-admin user and an admin.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PGlite } from '@electric-sql/pglite';
import { colleges, fees } from '../src/data/colleges.js';
import { sampleStories } from '../src/data/content.js';

const root = process.argv[2] ?? fileURLToPath(new URL('..', import.meta.url));
const db = new PGlite();
let pass = 0;
let fail = 0;
const check = async (name, fn) => {
  try {
    await fn();
    pass += 1;
    console.log(`  ok   ${name}`);
  } catch (error) {
    fail += 1;
    console.log(`  FAIL ${name}: ${error.message}`);
    await db.exec('rollback').catch(() => {}); // leave no half-finished transaction behind
  }
};
const expectError = async (sql, params = []) => {
  try {
    await db.query(sql, params);
  } catch {
    return;
  }
  throw new Error('expected an error, got none');
};

// Supabase stand-ins
await db.exec(`
  create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls;
  grant usage on schema public to anon, authenticated, service_role;
  create schema auth;
  create table auth.users (id uuid primary key, email text);
  create function auth.uid() returns uuid language sql stable as $$
    select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
  grant usage on schema auth to anon, authenticated;
  grant execute on function auth.uid() to anon, authenticated;
  create publication supabase_realtime;
  create schema cron;
  create table cron.job (jobid serial primary key, jobname text, schedule text, command text);
  create function cron.schedule(name text, sched text, cmd text) returns int language sql as $$
    insert into cron.job (jobname, schedule, command) values (name, sched, cmd) returning jobid $$;
  create function cron.unschedule(id int) returns boolean language sql as $$ delete from cron.job where jobid = id returning true $$;
`);

const migration = readFileSync(`${root}/supabase/migrations/0001_schema.sql`, 'utf8').replace(
  'create extension if not exists pg_cron;',
  '-- (pg_cron stand-in already created)'
);
const seed = readFileSync(`${root}/supabase/seed.sql`, 'utf8');
const voices = readFileSync(`${root}/supabase/migrations/0002_voices_and_tools.sql`, 'utf8');

console.log('Schema and seed');
await check('migration runs', () => db.exec(migration));
await check('migration runs again (re-runnable)', () => db.exec(migration));
await check('seed runs', () => db.exec(seed));
await check('seed runs again (re-runnable)', () => db.exec(seed));
await check('0002 (reviews & videos) runs', () => db.exec(voices));
await check('0002 runs again without duplicating samples', async () => {
  await db.exec(voices);
  const { rows } = await db.query('select count(*)::int n from testimonials');
  if (rows[0].n !== sampleStories.length) throw new Error(`${rows[0].n} rows`);
});
await check(`${colleges.length} colleges, ${fees.length} fees, cutoffs loaded`, async () => {
  const { rows } = await db.query(
    `select (select count(*) from colleges)::int c, (select count(*) from college_fees)::int f, (select count(*) from cutoffs)::int k`
  );
  if (rows[0].c !== colleges.length || rows[0].f !== fees.length || rows[0].k < 100)
    throw new Error(JSON.stringify(rows[0]));
});
await check('engineering fees and TNEA cutoff marks (out of 200) stored', async () => {
  const { rows } = await db.query(
    `select f.course, k.closing_marks::float m from colleges c
     join college_fees f on f.college_id = c.id join cutoffs k on k.college_id = c.id
     where c.slug = 'college-of-engineering-guindy' and k.counselling = 'TNEA' and k.category = 'OC'`
  );
  if (rows[0]?.course !== 'B.E. / B.Tech' || rows[0]?.m !== 199.5) throw new Error(JSON.stringify(rows[0]));
});
await check('cleanup job scheduled once', async () => {
  const { rows } = await db.query(`select count(*)::int n from cron.job where jobname = 'arivu-delete-old-leads'`);
  if (rows[0].n !== 1) throw new Error(`${rows[0].n} jobs`);
});
await check('leads in realtime publication', async () => {
  const { rows } = await db.query(
    `select count(*)::int n from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'leads'`
  );
  if (rows[0].n !== 1) throw new Error('missing');
});

const ADMIN = '11111111-1111-1111-1111-111111111111';
const USER = '22222222-2222-2222-2222-222222222222';
await db.exec(`insert into auth.users values ('${ADMIN}', 'admin@example.com'), ('${USER}', 'someone@example.com');
  insert into public.admins (user_id) values ('${ADMIN}');
  update public.colleges set is_published = false where slug = 'aiims-new-delhi';`);

const as = async (role, sub, fn) => {
  await db.exec(`set role ${role}; select set_config('request.jwt.claim.sub', '${sub ?? ''}', false);`);
  try {
    await fn();
  } finally {
    await db.exec(`reset role; select set_config('request.jwt.claim.sub', '', false);`);
  }
};
const lead = (over = {}) => ({
  name: 'Test Student',
  phone: '9876500001',
  email: 'Test@Example.com',
  stage: 'after_12',
  score: 'TNEA cutoff 192',
  category: 'BC',
  interest: 'engineering',
  college: null,
  source: 'hero',
  page: '/',
  consent: true,
  website: '',
  ...over,
});
const submit = (l) =>
  db.query('select public.submit_lead($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [
    l.name,
    l.phone,
    l.email,
    l.stage,
    l.score,
    l.category,
    l.interest,
    l.college,
    l.source,
    l.page,
    l.consent,
    l.website,
  ]);

console.log('Visitor (anon)');
await as('anon', null, async () => {
  await check(`reads published colleges only (${colleges.length - 1}, not the hidden one)`, async () => {
    const { rows } = await db.query('select count(*)::int n from colleges');
    if (rows[0].n !== colleges.length - 1) throw new Error(`${rows[0].n}`);
  });
  await check('cannot see fees of the hidden college', async () => {
    const { rows } = await db.query(
      `select count(*)::int n from college_fees f join colleges c on c.id = f.college_id where c.slug = 'aiims-new-delhi'`
    );
    if (rows[0].n !== 0) throw new Error(`${rows[0].n}`);
  });
  await check('sends a lead through submit_lead()', () => submit(lead()));
  await check('cannot read leads', () => expectError('select * from leads'));
  await check('cannot insert a lead directly', () =>
    expectError(
      `insert into leads (full_name, whatsapp, email, interest, consent) values ('X Y', '9876500002', 'a@b.co', 'india', true)`
    )
  );
  await check('cannot change fees', async () => {
    const r = await db.query('update college_fees set tuition_per_year = 1 returning id').catch(() => ({ rows: [] }));
    if (r.rows.length) throw new Error('updated rows');
  });
  await check('cannot add itself as admin', () => expectError(`insert into admins values ('${USER}')`));
  await check('reads published reviews and videos, but not hidden ones', async () => {
    await db.exec('reset role');
    await db.exec(`update testimonials set is_published = false where name = 'Mohammed Irfan'`);
    await db.exec('set role anon');
    const { rows } = await db.query('select count(*)::int n from testimonials');
    if (rows[0].n !== sampleStories.length - 1) throw new Error(`${rows[0].n}`);
  });
  await check('cannot add a review', () =>
    expectError(
      `insert into testimonials (kind, name, quote) values ('review', 'Fake Person', 'Best agency ever, five stars')`
    )
  );
  await check('cannot edit or delete reviews (0 rows)', async () => {
    const a = await db.query(`update testimonials set rating = 1 returning id`).catch(() => ({ rows: [] }));
    const b = await db.query(`delete from testimonials returning id`).catch(() => ({ rows: [] }));
    if (a.rows.length || b.rows.length) throw new Error('changed rows');
  });
  await check('NEET calculator leads are accepted', () =>
    submit(lead({ source: 'neet_calculator', phone: '9876500008' }))
  );
  await check('rejects a bad phone number', () =>
    submit(lead({ phone: '12345' })).then(
      () => {
        throw new Error('accepted');
      },
      () => {}
    )
  );
  await check('rejects a missing consent', () =>
    submit(lead({ consent: false, phone: '9876500003' })).then(
      () => {
        throw new Error('accepted');
      },
      () => {}
    )
  );
  await check('rejects a bad email', () =>
    submit(lead({ email: 'not-an-email', phone: '9876500004' })).then(
      () => {
        throw new Error('accepted');
      },
      () => {}
    )
  );
  await check('rejects an unknown stage', () =>
    submit(lead({ stage: 'class_5', phone: '9876500006' })).then(
      () => {
        throw new Error('accepted');
      },
      () => {}
    )
  );
  await check('rejects an unknown interest', () =>
    submit(lead({ interest: 'astrology', phone: '9876500007' })).then(
      () => {
        throw new Error('accepted');
      },
      () => {}
    )
  );
  await check('spam trap: filled field is silently dropped', () =>
    submit(lead({ website: 'http://spam', phone: '9876500005' }))
  );
  await check('limit: 6th lead from one number in an hour is refused', async () => {
    for (let i = 0; i < 4; i += 1) await submit(lead()); // 5 in total with the first one
    await submit(lead()).then(
      () => {
        throw new Error('accepted 6th');
      },
      () => {}
    );
  });
});

console.log('Signed-in non-admin');
await as('authenticated', USER, async () => {
  await check('cannot read leads (0 rows)', async () => {
    const { rows } = await db.query('select count(*)::int n from leads');
    if (rows[0].n !== 0) throw new Error(`${rows[0].n}`);
  });
  await check('is_admin() is false', async () => {
    const { rows } = await db.query('select public.is_admin() a');
    if (rows[0].a !== false) throw new Error('true');
  });
  await check('cannot change fees (0 rows)', async () => {
    const { rows } = await db.query('update college_fees set tuition_per_year = 1 returning id');
    if (rows.length) throw new Error(`${rows.length} rows`);
  });
});

console.log('Admin');
await as('authenticated', ADMIN, async () => {
  await check('reads all leads (6 real, spam dropped)', async () => {
    const { rows } = await db.query('select whatsapp, email from leads');
    if (rows.length !== 6) throw new Error(`${rows.length}`);
    if (rows[0].email !== 'test@example.com') throw new Error('email not lower-cased');
  });
  await check('sees the hidden college', async () => {
    const { rows } = await db.query('select count(*)::int n from colleges');
    if (rows[0].n !== colleges.length) throw new Error(`${rows[0].n}`);
  });
  await check('changes a fee; updated_by is recorded', async () => {
    const { rows } = await db.query(
      `update college_fees set tuition_per_year = 1575000 where quota = 'management'
       and college_id = (select id from colleges where slug = 'karpagam-faculty-of-medical-sciences') returning updated_by`
    );
    if (rows.length !== 1 || rows[0].updated_by !== ADMIN) throw new Error(JSON.stringify(rows));
  });
  await check('rejects a negative fee', () =>
    expectError(`update college_fees set tuition_per_year = -5 where quota = 'nri'`)
  );
  await check('updates a lead status', async () => {
    const { rows } = await db.query(`update leads set status = 'contacted' returning id`);
    if (rows.length !== 6) throw new Error(`${rows.length}`);
  });
  await check('rejects an unknown status', () => expectError(`update leads set status = 'paid'`));
  await check('deletes a lead', async () => {
    const { rows } = await db.query(`delete from leads where id = (select id from leads limit 1) returning id`);
    if (rows.length !== 1) throw new Error('not deleted');
  });
  await check('adds a video with a YouTube link', async () => {
    const { rows } = await db.query(
      `insert into testimonials (kind, name, title, video_url, stream) values ('video', 'Test Student', 'My first year', 'https://youtu.be/abcdefghijk', 'medical') returning id`
    );
    if (rows.length !== 1) throw new Error('not added');
  });
  await check('rejects a review with no words', () =>
    expectError(`insert into testimonials (kind, name, quote) values ('review', 'Someone', '')`)
  );
  await check('rejects a 6-star rating', () => expectError(`update testimonials set rating = 6 where kind = 'review'`));
  await check('sees hidden reviews, can hide and delete', async () => {
    const all = await db.query('select count(*)::int n from testimonials');
    if (all.rows[0].n !== sampleStories.length + 1) throw new Error(`${all.rows[0].n}`);
    const del = await db.query(`delete from testimonials where name = 'Test Student' returning id`);
    if (del.rows.length !== 1) throw new Error('not deleted');
  });
});

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
