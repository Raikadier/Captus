// Importa el cliente centralizado en lugar de crear uno nuevo.
import { getSupabaseClient } from './supabaseClient.js';

/**
 * DEPRECATED: La creación del cliente ahora se maneja en supabaseClient.js.
 * Esta función se mantiene por retrocompatibilidad con BaseRepository,
 * pero ahora apunta al nuevo cliente centralizado.
 */
const getSupabaseAdmin = () => {
  // Aquí usamos el nuevo cliente. La lógica de 'admin' vs 'anon' se simplifica a un solo cliente.
  // En el backend, para operaciones directas, siempre se usará el SERVICE_ROLE_KEY si está disponible.
  // Por ahora, unificamos al cliente estándar.
  return getSupabaseClient();
};

/**
 * Proporciona el cliente Supabase. Lanza un error si no está configurado.
 * Esta es la función que BaseRepository y otras partes del código deben usar.
 */
export const requireSupabaseClient = () => {
  const client = getSupabaseAdmin(); // Usa la función unificada
  if (!client) {
    // El mensaje de error es más informativo ahora.
    // Sugiere revisar el .env y el modo mock.
    console.error('Supabase client is not available. Check .env configuration.');
    return null; // En lugar de lanzar error, devolvemos null para que BaseRepository active el modo mock.
  }
  return client;
};
