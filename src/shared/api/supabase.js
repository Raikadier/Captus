import { createClient } from '@supabase/supabase-js';

// Frontend Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;
if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);

  // Keep backend Authorization header in sync with current Supabase session
  // We reuse localStorage key 'token' so existing axios interceptor in client.js continues to work.
  supabase.auth.onAuthStateChange((_event, session) => {
    const accessToken = session?.access_token || null;
    if (accessToken) {
      localStorage.setItem('token', accessToken);
    } else {
      localStorage.removeItem('token');
    }
  });
} else {
  // Frontend-only mode: safe mock client so the app can run without env vars
  console.warn('Supabase env not set; running in frontend-only mode without Supabase.');
  const authMock = {
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    getSession: async () => ({ data: { session: null } }),
    getUser: async () => ({ data: { user: null } }),
  };
  supabase = { auth: authMock };
}

export { supabase };

// Helpers
export async function getCurrentSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getAccessToken() {
  const session = await getCurrentSession();
  return session?.access_token || null;
}

export async function getCurrentUser() {
  const { data } = await supabase.auth.getUser();
  return data?.user ?? null;
}