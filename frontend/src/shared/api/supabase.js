import { createClient } from '@supabase/supabase-js';

// Frontend Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is missing. Check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Keep backend Authorization header in sync with current Supabase session
supabase.auth.onAuthStateChange((event, session) => {
  const accessToken = session?.access_token || null;

  if (accessToken) {
    localStorage.setItem('token', accessToken);
  } else {
    localStorage.removeItem('token');
  }

  // Optional: Log auth events for debugging
  // console.log('Supabase Auth Event:', event);
});

// Helpers
export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) {
    console.error('Error getting session:', error);
    return null;
  }
  return data.session;
}

export async function getAccessToken() {
  const session = await getCurrentSession();
  return session?.access_token || null;
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    // It's common to not have a user if not logged in, so maybe just return null
    return null;
  }
  return data?.user ?? null;
}
