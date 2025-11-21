// Cliente base para peticiones HTTP
// Por ahora simulamos las respuestas, pero aquí conectaremos con el backend real

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Simulación de retardo de red
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  get: async <T>(endpoint: string): Promise<T> => {
    // En el futuro: const response = await fetch(`${API_URL}${endpoint}`);
    // return response.json();
    await delay(500); // Simular carga
    console.log(`[API] GET ${endpoint}`);
    return {} as T; // Placeholder
  },

  post: async <T>(endpoint: string, data: any): Promise<T> => {
    await delay(500);
    console.log(`[API] POST ${endpoint}`, data);
    return {} as T;
  },

  put: async <T>(endpoint: string, data: any): Promise<T> => {
    await delay(500);
    console.log(`[API] PUT ${endpoint}`, data);
    return {} as T;
  },

  delete: async <T>(endpoint: string): Promise<T> => {
    await delay(500);
    console.log(`[API] DELETE ${endpoint}`);
    return {} as T;
  }
};
