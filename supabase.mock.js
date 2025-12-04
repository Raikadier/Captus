/**
 * @file supabase.mock.js
 * @description Mock completo en memoria de Supabase para testing.
 * Simula repositorios de tareas, notas y eventos con aislamiento por usuario.
 */

/**
 * Almacenamiento en memoria para cada tipo de recurso
 */ const storage = {
    tasks: [],
    notes: [],
    events: [],
    users: [],
    statistics: [],
};

let nextId = 1;

/**
 * Mock del TaskRepository
 */
export class MockTaskRepository {
    async save(task) {
        const newTask = {
            id_Task: nextId++,
            ...task,
            creationDate: task.creationDate || new Date(),
            state: task.state ?? false,
        };
        storage.tasks.push(newTask);
        return newTask;
    }

    async getById(taskId) {
        return storage.tasks.find((t) => t.id_Task === parseInt(taskId));
    }

    async getAllByUserId(userId) {
        return storage.tasks.filter((t) => t.id_User === userId || t.user_id === userId);
    }

    async update(task) {
        const index = storage.tasks.findIndex((t) => t.id_Task === task.id_Task);
        if (index !== -1) {
            storage.tasks[index] = { ...storage.tasks[index], ...task };
            return storage.tasks[index];
        }
        return null;
    }

    async delete(taskId) {
        const index = storage.tasks.findIndex((t) => t.id_Task === parseInt(taskId));
        if (index !== -1) {
            storage.tasks.splice(index, 1);
            return true;
        }
        return false;
    }
}

/**
 * Mock del NotesRepository
 */
export class MockNotesRepository {
    async save(note) {
        const newNote = {
            id_Note: nextId++,
            ...note,
            created_at: note.created_at || new Date(),
            update_at: note.update_at || new Date(),
            pinned: note.pinned ?? false,
        };
        storage.notes.push(newNote);
        return newNote;
    }

    async getById(noteId) {
        return storage.notes.find((n) => n.id_Note === parseInt(noteId));
    }

    async getAllByUserId(userId) {
        return storage.notes.filter((n) => n.user_id === userId);
    }

    async update(note) {
        const index = storage.notes.findIndex((n) => n.id_Note === note.id_Note);
        if (index !== -1) {
            storage.notes[index] = { ...storage.notes[index], ...note };
            return storage.notes[index];
        }
        return null;
    }

    async delete(noteId) {
        const index = storage.notes.findIndex((n) => n.id_Note === parseInt(noteId));
        if (index !== -1) {
            storage.notes.splice(index, 1);
            return true;
        }
        return false;
    }

    async togglePin(noteId, userId) {
        const note = storage.notes.find((n) => n.id_Note === parseInt(noteId) && n.user_id === userId);
        if (note note.pinned = !note.pinned;
        return note;
    }
    return null;
  }
}

/**
 * Mock del EventsRepository
 */
export class MockEventsRepository {
    async save(event) {
        const newEvent = {
            id_Event: nextId++,
            ...event,
            created_at: event.created_at || new Date(),
        };
        storage.events.push(newEvent);
        return newEvent;
    }

    async getById(eventId) {
        return storage.events.find((e) => e.id_Event === parseInt(eventId));
    }

    async getAllByUserId(userId) {
        return storage.events.filter((e) => e.user_id === userId);
    }

    async update(event) {
        const index = storage.events.findIndex((e) => e.id_Event === event.id_Event);
        if (index !== -1) {
            storage.events[index] = { ...storage.events[index], ...event };
            return storage.events[index];
        }
        return null;
    }

    async delete(eventId) {
        const index = storage.events.findIndex((e) => e.id_Event === parseInt(eventId));
        if (index !== -1) {
            storage.events.splice(index, 1);
            return true;
        }
        return false;
    }

    async getByDateRange(userId, startDate, endDate) {
        return storage.events.filter((e) => {
            if (e.user_id !== userId) return false;
            const eventStart = new Date(e.start_date);
            return eventStart >= new Date(startDate) && eventStart <= new Date(endDate);
        });
    }
}

/**
 * Mock de otros repositorios auxiliares
 */
export class MockSubTaskRepository {
    async getAllByTaskId(taskId) {
        return []; // Simplificado para tests
    }

    async delete(subTaskId) {
        return true;
    }
}

export class MockPriorityRepository {
    async getById(priorityId) {
        return { id_Priority: priorityId, name: 'High' };
    }
}

export class MockCategoryRepository {
    async getById(categoryId) {
        return { id_Category: categoryId, name: 'Academic' };
    }
}

export class MockStatisticsRepository {
    async getByUser(userId) {
        let stats = storage.statistics.find((s) => s.user_id === userId);
        if (!stats) {
            stats = { user_id: userId, completedTasks: 0 };
            storage.statistics.push(stats);
        }
        return stats;
    }

    async update(stats) {
        const index = storage.statistics.findIndex((s) => s.user_id === stats.user_id);
        if (index !== -1) {
            storage.statistics[index] = stats;
            return stats;
        }
        return null;
    }
}

/**
 * Función para resetear todo el almacenamiento entre tests
 */
export function resetMockStorage() {
    storage.tasks = [];
    storage.notes = [];
    storage.events = [];
    storage.users = [];
    storage.statistics = [];
    nextId = 1;
}

/**
 * Función helper para obtener el storage (útil para debugging)
 */
export function getMockStorage() {
    return storage;
}
