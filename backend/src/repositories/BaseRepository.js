import { requireSupabaseClient } from '../lib/supabaseAdmin.js';
import { isMockMode } from '../lib/supabaseClient.js';
import mockData from '../lib/mockData.js';

export default class BaseRepository {
  constructor(tableName, { primaryKey = 'id', mapToDb, mapFromDb, select = '*' } = {}) {
    this.tableName = tableName;
    this.primaryKey = primaryKey;
    this.mapToDb = mapToDb || ((entity) => entity);
    this.mapFromDb = mapFromDb || ((row) => row);
    this.select = select;
    this.client = requireSupabaseClient();
    this.mockSet = mockData[this.tableName] || [];
  }

  // --- Operaciones de Escritura (siempre a Supabase) ---
  // Se elimina cualquier lógica condicional. Operan solo con el cliente.

  async save(entity) {
    if (!this.client) throw new Error("Supabase client no disponible.");
    const payload = this.mapToDb(entity);
    const { data, error } = await this.client.from(this.tableName).insert(payload).select(this.select).single();
    if (error) throw new Error(`Error en Supabase (save): ${error.message}`);
    return this.mapFromDb(data);
  }

  async update(id, entity) {
    if (!this.client) throw new Error("Supabase client no disponible.");
    const payload = this.mapToDb(entity);
    const { data, error } = await this.client.from(this.tableName).update(payload).eq(this.primaryKey, id).select(this.select).single();
    if (error) throw new Error(`Error en Supabase (update): ${error.message}`);
    return this.mapFromDb(data);
  }

  async delete(id) {
    if (!this.client) throw new Error("Supabase client no disponible.");
    const { error } = await this.client.from(this.tableName).delete().eq(this.primaryKey, id);
    if (error) throw new Error(`Error en Supabase (delete): ${error.message}`);
    return true;
  }

  // --- Operaciones de Lectura (Lógica Aditiva Correcta) ---

  async getById(id) {
    // 1. Buscar siempre en Supabase primero (si el cliente existe)
    if (this.client) {
      const { data, error } = await this.client.from(this.tableName).select(this.select).eq(this.primaryKey, id).single();
      if (error && error.code !== 'PGRST116') throw new Error(error.message);
      if (data) return this.mapFromDb(data);
    }

    // 2. Si no se encontró en Supabase y el modo mock está activo, buscar en los mocks.
    if (isMockMode()) {
      return this.mockSet.find(item => item[this.primaryKey] == id) || null;
    }

    return null; // Si no está en Supabase y el modo mock está desactivado, no hay nada que devolver.
  }

  async getAll(match = {}) {
    let supabaseData = [];

    // 1. Obtener siempre los datos de Supabase (si el cliente existe)
    if (this.client) {
      let query = this.client.from(this.tableName).select(this.select);
      Object.entries(match).forEach(([key, value]) => {
        query = value === null ? query.is(key, null) : query.eq(key, value);
      });
      const { data, error } = await query;
      if (error) throw new Error(error.message);
      supabaseData = data.map(this.mapFromDb);
    }

    // 2. Si el modo mock está activo, añadir los mocks que no existan en Supabase.
    if (isMockMode()) {
      const supabaseIds = new Set(supabaseData.map(item => item[this.primaryKey]));

      const additiveMocks = this.mockSet
        // Primero, filtrar los mocks según el `match`
        .filter(item => Object.entries(match).every(([key, value]) => item[key] === value))
        // Segundo, filtrar los que ya existen en Supabase para no duplicar
        .filter(mockItem => !supabaseIds.has(mockItem[this.primaryKey]));

      return [...supabaseData, ...additiveMocks];
    }

    // 3. Si el modo mock no está activo, devolver solo los datos de Supabase.
    return supabaseData;
  }
}
