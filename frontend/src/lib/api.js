import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

const api = {
  async request(endpoint, method = 'GET', body = null) {
    const { data: { session } } = await supabase.auth.getSession();

    const headers = {
      'Content-Type': 'application/json',
    };

    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    const config = {
      method,
      headers,
    };

    if (body) {
      config.body = JSON.stringify(body);
    }

    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    // Return object with .data property to mimic Axios structure used in components
    const responseData = await response.json();
    return { data: responseData };
  },

  get(endpoint) {
    return this.request(endpoint, 'GET');
  },

  post(endpoint, body) {
    return this.request(endpoint, 'POST', body);
  },

  put(endpoint, body) {
    return this.request(endpoint, 'PUT', body);
  },

  delete(endpoint) {
    return this.request(endpoint, 'DELETE');
  }
};

export default api;
