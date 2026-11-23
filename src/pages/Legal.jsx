import PageHeader from '../components/PageHeader.jsx';
import { site } from '../data/site.js';
import { useTitle } from '../lib/useAsync.js';

export function Privacy() {
  useTitle('Privacy policy');
  return (
    <>
      <PageHeader
        crumbs={[['Privacy policy']]}
        title="Privacy"
        accent="policy"
        text="Sample policy for the demo, written for India’s Digital Personal Data Protection Act, 2023. To be reviewed with the client."
      />
      <section className="pb-8">
        <div className="container-page prose-guide max-w-3xl">
          <h2>What we collect</h2>
          <p>
            When you send a form, we collect the student’s name, WhatsApp number, email, their class or stage, what they
            are looking for, and (if you give them) marks or exam scores, category and the college they were viewing. We
            also note which page you sent it from.
          </p>
          <h2>Why we collect it</h2>
          <ul>
            <li>
              To contact you on WhatsApp, phone or email about career guidance and admissions, as you agreed on the
              form.
            </li>
            <li>To prepare a college list and fee comparison for you.</li>
          </ul>
          <p>We do not sell your details or share them with colleges without asking you first.</p>
          <h2>Where it is stored</h2>
          <p>
            Your details are stored in our database (Supabase, Mumbai region). Only our counselling team can see them,
            after signing in.
          </p>
          <h2>How long we keep it</h2>
          <p>
            Enquiries that don’t lead to counselling are deleted within 12 months. Students we work with: for as long as
            we are helping you, plus what the law requires for invoices.
          </p>
          <h2>Your choices</h2>
          <p>
            You can withdraw consent, ask for a copy of your details, or ask us to delete them at any time: write to{' '}
            <a href={`mailto:${site.email}`}>{site.email}</a> or WhatsApp {site.phone}.
          </p>
          <h2>Cookies</h2>
          <p>
            We don’t use advertising or tracking cookies. Your browser remembers that you have sent the form, so you
            aren’t asked again; clearing your browser data removes this.
          </p>
          <h2>Videos</h2>
          <p>
            Student videos are hosted on YouTube. Until you press play, only the preview picture is loaded from
            YouTube’s image server. The player opens in YouTube’s privacy-enhanced mode, and YouTube’s own privacy
            policy applies to the video.
          </p>
        </div>
      </section>
    </>
  );
}

export function Terms() {
  useTitle('Terms');
  return (
    <>
      <PageHeader
        crumbs={[['Terms']]}
        title="Terms of"
        accent="use"
        text="Sample terms for the demo. To be reviewed with the client."
      />
      <section className="pb-8">
        <div className="container-page prose-guide max-w-3xl">
          <h2>Guidance, not a guarantee</h2>
          <p>
            {site.name} gives counselling and guidance. Seats are allotted only by the official counselling authorities
            (MCC, state selection committees and universities). We cannot and do not promise any seat.
          </p>
          <h2>Fees and cutoffs</h2>
          <p>
            Fees and cutoffs on this site are collected from official notices and colleges, and can change. Always
            confirm the final fee with the college or counselling authority before paying.
          </p>
          <h2>Partner colleges</h2>
          <p>
            Some colleges have a tie-up with us. They are labelled “Partner college” wherever they appear. Being a
            partner never changes the facts we show about a college.
          </p>
          <h2>Our service fee</h2>
          <p>The first counselling session is free. Any paid service is explained and agreed in writing first.</p>
        </div>
      </section>
    </>
  );
}
