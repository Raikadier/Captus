import BaseRepository from "./BaseRepository.js";

const mapFromDb = (row) => ({
  id_SubTask: row.id,
  title: row.title,
  description: row.description,
  creationDate: row.created_at,
  endDate: row.due_date,
  id_Priority: row.priority_id,
  id_Category: row.category_id,
  state: row.completed,
  id_Task: row.parent_task_id,
  id_User: row.user_id,
});

const mapToDb = (entity) => ({
  title: entity.title,
  description: entity.description ?? null,
  due_date: entity.endDate ?? null,
  priority_id: entity.id_Priority ?? null,
  category_id: entity.id_Category ?? null,
  completed: entity.state ?? false,
  user_id: entity.id_User,
  parent_task_id: entity.id_Task,
});

class SubTaskRepository extends BaseRepository {
  constructor() {
    super("tasks", {
      primaryKey: "id",
      mapFromDb,
      mapToDb,
    });
  }

  async save(subTask) {
    return super.save(subTask);
  }

  async getAllByTaskId(taskId) {
    if (!taskId) return [];
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("parent_task_id", taskId)
      .order("created_at", { ascending: true });

    if (error) {
      throw new Error(error.message);
    }

    return data.map(mapFromDb);
  }

  async getById(id) {
    return super.getById(id);
  }

  async update(subTask) {
    if (!subTask?.id_SubTask) return null;
    return super.update(subTask.id_SubTask, subTask);
  }

  async delete(id) {
    if (!id) return false;
    const { error } = await this.client.from(this.tableName).delete().eq("id", id);
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }

  async markAllAsCompleted(taskId) {
    if (!taskId) return false;
    const { error } = await this.client
      .from(this.tableName)
      .update({ completed: true })
      .eq("parent_task_id", taskId);
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }
}

export default SubTaskRepository;
