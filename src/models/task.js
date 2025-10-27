// Task model - migrated from C# ENTITY\Task.cs
class Task {
  constructor(data = {}) {
    this.id = data.id || null;
    this.title = data.title || '';
    this.description = data.description || null;
    this.created_at = data.created_at || new Date();
    this.due_date = data.due_date || null;
    this.priority_id = data.priority_id || 1;
    this.category_id = data.category_id || 1;
    this.completed = data.completed || false;
    this.user_id = data.user_id || null;
    this.parent_task_id = data.parent_task_id || null; // For subtasks
    this.updated_at = data.updated_at || new Date();
  }

  // Check if task is overdue
  get isOverdue() {
    if (!this.due_date || this.completed) return false;
    return new Date() > new Date(this.due_date);
  }

  // Mark as completed
  checkLikeCompleted() {
    this.completed = true;
  }

  // Mark as incomplete
  uncheckLikeCompleted() {
    this.completed = false;
  }

  // Validate task data
  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length === 0) {
      errors.push('Task title cannot be empty');
    }

    if (!this.user_id) {
      errors.push('User ID is required');
    }

    if (this.due_date && new Date(this.due_date) < new Date()) {
      // Allow past due dates for existing tasks, but warn for new ones
      if (!this.id) {
        errors.push('Due date cannot be in the past');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Convert to database format
  toDatabase() {
    return {
      title: this.title,
      description: this.description,
      due_date: this.due_date,
      priority_id: this.priority_id,
      category_id: this.category_id,
      completed: this.completed,
      user_id: this.user_id,
      parent_task_id: this.parent_task_id,
      updated_at: new Date()
    };
  }

  // Create from database row
  static fromDatabase(row) {
    return new Task({
      id: row.id,
      title: row.title,
      description: row.description,
      created_at: row.created_at,
      due_date: row.due_date,
      priority_id: row.priority_id,
      category_id: row.category_id,
      completed: row.completed,
      user_id: row.user_id,
      parent_task_id: row.parent_task_id,
      updated_at: row.updated_at
    });
  }
}

export default Task;