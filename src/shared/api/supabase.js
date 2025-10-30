import { createClient } from '@supabase/supabase-js';

// Frontend Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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