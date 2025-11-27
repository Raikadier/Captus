// backend/src/services/NotesService.js
import NotesRepository from "../repositories/NotesRepository.js";
import { OperationResult } from "../shared/OperationResult.js";

const notesRepository = new NotesRepository();

/**
 * Servicio para la gestión de notas.
 * Sigue un patrón stateless donde cada método recibe el userId para validación.
 */
export class NotesService {

  constructor() {}

  /**
   * Valida los datos de una nota.
   * @param {object} note - El objeto de la nota.
   * @returns {OperationResult} - El resultado de la validación.
   */
  validateNote(note) {
    if (!note) {
      return new OperationResult(false, "La nota no puede ser nula.");
    }
    if (!note.title || note.title.trim() === "") {
      return new OperationResult(false, "El título de la nota no puede estar vacío.");
    }
    return new OperationResult(true);
  }

  /**
   * Crea una nueva nota.
   * @param {object} noteData - Datos de la nota.
   * @param {string} userId - ID del usuario propietario.
   * @returns {Promise<OperationResult>}
   */
  async create(noteData, userId) {
    try {
      const validation = this.validateNote(noteData);
      if (!validation.success) return validation;

      const noteToSave = {
        ...noteData,
        user_id: userId,
      };

      const savedNote = await notesRepository.save(noteToSave);
      return new OperationResult(true, `Nota "${savedNote.title}" creada exitosamente.`, savedNote);
    } catch (error) {
      console.error(`Error inesperado en NotesService.create: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al crear la nota.");
    }
  }

  /**
   * Actualiza una nota existente.
   * @param {string|number} noteId - ID de la nota.
   * @param {object} updates - Campos a actualizar.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<OperationResult>}
   */
  async update(noteId, updates, userId) {
    try {
      const validation = this.validateNote(updates, true);
      if (!validation.success) return validation;

      const existingNote = await notesRepository.getById(noteId);
      if (!existingNote) {
        return new OperationResult(false, "Nota no encontrada.");
      }
      if (existingNote.user_id !== userId) {
        return new OperationResult(false, "No tienes permiso para actualizar esta nota.");
      }

      const noteToUpdate = { ...existingNote, ...updates, update_at: new Date() };
      const updatedNote = await notesRepository.update(noteToUpdate);
      return new OperationResult(true, "Nota actualizada exitosamente.", updatedNote);
    } catch (error) {
      console.error(`Error inesperado en NotesService.update: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al actualizar la nota.");
    }
  }

  /**
   * Elimina una nota.
   * @param {string|number} noteId - ID de la nota.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<OperationResult>}
   */
  async delete(noteId, userId) {
    try {
      const existingNote = await notesRepository.getById(noteId);
      if (!existingNote) {
        return new OperationResult(false, "Nota no encontrada.");
      }
      if (existingNote.user_id !== userId) {
        return new OperationResult(false, "No tienes permiso para eliminar esta nota.");
      }

      await notesRepository.delete(noteId);
      return new OperationResult(true, "Nota eliminada exitosamente.");
    } catch (error) {
      console.error(`Error inesperado en NotesService.delete: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al eliminar la nota.");
    }
  }

  /**
   * Obtiene una nota por su ID.
   * @param {string|number} noteId - ID de la nota.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<OperationResult>}
   */
  async getById(noteId, userId) {
    try {
      const note = await notesRepository.getById(noteId);
      if (!note) {
        return new OperationResult(false, "Nota no encontrada.");
      }
      if (note.user_id !== userId) {
        return new OperationResult(false, "No tienes permiso para ver esta nota.");
      }
      return new OperationResult(true, "Nota encontrada.", note);
    } catch (error) {
      console.error(`Error inesperado en NotesService.getById: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al obtener la nota.");
    }
  }

  /**
   * Obtiene todas las notas de un usuario.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<OperationResult>}
   */
  async getAll(userId) {
    try {
      const notes = await notesRepository.getAllByUserId(userId);
      return new OperationResult(true, "Notas obtenidas exitosamente.", notes);
    } catch (error) {
      console.error(`Error inesperado en NotesService.getAll: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al obtener las notas.");
    }
  }

  /**
   * Cambia el estado de fijado de una nota.
   * @param {string|number} noteId - ID de la nota.
   * @param {string} userId - ID del usuario.
   * @returns {Promise<OperationResult>}
   */
  async togglePin(noteId, userId) {
    try {
      // La validación de propiedad la hace el propio repositorio en este caso.
      const toggled = await notesRepository.togglePin(noteId, userId);
      if (toggled) {
        return new OperationResult(true, "Estado de fijación de la nota actualizado.", toggled);
      } else {
        // Esto podría pasar si la nota no se encuentra o no pertenece al usuario.
        return new OperationResult(false, "No se pudo actualizar el estado de fijación de la nota.");
      }
    } catch (error) {
      console.error(`Error inesperado en NotesService.togglePin: ${error.message}`);
      throw new Error("Ocurrió un error inesperado al cambiar el estado de fijación.");
    }
  }
}
