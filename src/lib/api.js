// One data API for the whole site. Picks the backend once:
// - Supabase keys set  → the real database (lib/backend/supabase.js)
// - no keys            → DEMO MODE on sample data (lib/backend/demo.js)
// The Supabase library is only downloaded when it is actually used.

export const isDemo = !(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY);

let backend;
const load = () => (backend ??= isDemo ? import('./backend/demo.js') : import('./backend/supabase.js'));

const call =
  (name) =>
  async (...args) =>
    (await load())[name](...args);

export const listColleges = call('listColleges');
export const getCollege = call('getCollege');
export const submitLead = call('submitLead');

export const getAdminSession = call('getAdminSession');
export const signIn = call('signIn');
export const signOut = call('signOut');
export const listLeads = call('listLeads');
export const updateLead = call('updateLead');
export const deleteLead = call('deleteLead');
export const adminListColleges = call('adminListColleges');
export const saveCollege = call('saveCollege');
export const saveFees = call('saveFees');
export const resetDemo = call('resetDemo');

export const listTestimonials = call('listTestimonials');
export const adminListTestimonials = call('adminListTestimonials');
export const saveTestimonial = call('saveTestimonial');
export const deleteTestimonial = call('deleteTestimonial');

// Live lead updates. Returns an unsubscribe function straight away.
export function subscribeLeads(onChange) {
  let unsubscribe = () => {};
  let cancelled = false;
  load().then((module) => {
    if (!cancelled) unsubscribe = module.subscribeLeads(onChange);
  });
  return () => {
    cancelled = true;
    unsubscribe();
  };
}
