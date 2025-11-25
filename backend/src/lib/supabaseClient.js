import { createClient } from '@supabase/supabase-js';

let cachedClient = null;

// La inicialización del cliente se mueve DENTRO de la función getSupabaseClient.
// Esto asegura que `process.env` ya esté poblado por dotenv cuando se llame.
export const getSupabaseClient = () => {
  if (cachedClient) {
    return cachedClient;
  }

  const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.warn('Supabase URL o Service Role Key no encontradas. La conexión a Supabase no estará disponible.');
    return null;
  }

  cachedClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
    },
  });

  return cachedClient;
};

export const isMockMode = () => {
  return process.env.FORCE_MOCK_MODE === 'true';
};
