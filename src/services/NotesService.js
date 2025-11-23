import NotesRepository from "../repositories/NotesRepository.js";
import { OperationResult } from "../shared/OperationResult.js";

const notesRepository = new NotesRepository();

export class NotesService {
  constructor() {
    this.currentUser = null;
  }

  setCurrentUser(user) {
    this.currentUser = user;
  }

  validateNote(note) {
    if (!note) {
      return new OperationResult(false, "La nota no puede ser nula.");
    }

    if (!note.title || note.title.trim() === "") {
      return new OperationResult(false, "El título de la nota no puede estar vacío.");
    }

    return new OperationResult(true);
  }

  async create(note) {
    return this.save(note);
  }

  async save(note) {
    try {
      const validation = this.validateNote(note);
      if (!validation.success) return validation;

      note.user_id = this.currentUser?.id;

      if (!note.user_id) {
        return new OperationResult(false, "Usuario no autenticado.");
      }

      const savedNote = await notesRepository.save(note);
      if (savedNote) {
        return new OperationResult(true, "Nota guardada exitosamente.", savedNote);
      } else {
        return new OperationResult(false, "Error al guardar la nota.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al guardar la nota: ${error.message}`);
    }
  }

  async getAll() {
    try {
      if (!this.currentUser) {
        return new OperationResult(false, "Usuario no autenticado.");
      }

      const notes = await notesRepository.getAllByUserId(this.currentUser.id);
      return new OperationResult(true, "Notas obtenidas exitosamente.", notes);
    } catch (error) {
      return new OperationResult(false, `Error al obtener notas: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      if (!id) {
        return new OperationResult(false, "ID de nota inválido.");
      }

      const note = await notesRepository.getById(id);
      if (note) {
        if (note.user_id === this.currentUser?.id) {
          return new OperationResult(true, "Nota encontrada.", note);
        } else {
          return new OperationResult(false, "Nota no accesible.");
        }
      } else {
        return new OperationResult(false, "Nota no encontrada.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al obtener nota: ${error.message}`);
    }
  }

  async update(note) {
    try {
      const validation = this.validateNote(note);
      if (!validation.success) return validation;

      const existingNote = await notesRepository.getById(note.id);
      if (!existingNote) {
        return new OperationResult(false, "Nota no encontrada.");
      }

      if (existingNote.user_id !== this.currentUser?.id) {
        return new OperationResult(false, "Nota no accesible.");
      }

      // Update the update_at timestamp
      note.update_at = new Date();

      const updated = await notesRepository.update(note);
      if (updated) {
        return new OperationResult(true, "Nota actualizada exitosamente.", updated);
      } else {
        return new OperationResult(false, "Error al actualizar la nota.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al actualizar nota: ${error.message}`);
    }
  }

  async togglePin(id) {
    try {
      if (!id) {
        return new OperationResult(false, "ID de nota inválido.");
      }

      const toggled = await notesRepository.togglePin(id, this.currentUser?.id);
      if (toggled) {
        return new OperationResult(true, "Estado de fijación actualizado.", toggled);
      } else {
        return new OperationResult(false, "Error al actualizar el estado de fijación.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al cambiar estado de fijación: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      if (!id) {
        return new OperationResult(false, "ID de nota inválido.");
      }

      const existingNote = await notesRepository.getById(id);
      if (!existingNote) {
        return new OperationResult(false, "Nota no encontrada.");
      }

      if (existingNote.user_id !== this.currentUser?.id) {
        return new OperationResult(false, "Nota no accesible.");
      }

      const deleted = await notesRepository.delete(id);
      if (deleted) {
        return new OperationResult(true, "Nota eliminada exitosamente.");
      } else {
        return new OperationResult(false, "Error al eliminar la nota.");
      }
    } catch (error) {
      return new OperationResult(false, `Error al eliminar nota: ${error.message}`);
    }
  }
}