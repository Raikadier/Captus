import BaseRepository from "./BaseRepository.js";

const mapFromDb = (row) => ({
  id_Task: row.id,
  title: row.title,
  description: row.description,
  creationDate: row.created_at,
  endDate: row.due_date,
  id_Priority: row.priority_id,
  id_Category: row.category_id,
  state: row.completed,
  id_User: row.user_id,
  parentTaskId: row.parent_task_id,
  updatedAt: row.updated_at,
});

const mapToDb = (entity) => ({
  title: entity.title,
  description: entity.description ?? null,
  due_date: entity.endDate ?? null,
  priority_id: entity.id_Priority ?? null,
  category_id: entity.id_Category ?? null,
  completed: entity.state ?? false,
  user_id: entity.id_User,
  parent_task_id: entity.parentTaskId ?? null,
});

class TaskRepository extends BaseRepository {
  constructor() {
    super("tasks", {
      primaryKey: "id",
      mapFromDb,
      mapToDb,
    });
  }

  async save(task) {
    return super.save(task);
  }

  async update(task) {
    if (!task?.id_Task) return null;
    return super.update(task.id_Task, task);
  }

  async getAllByUserId(userId) {
    if (!userId) return [];
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .is("parent_task_id", null)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data.map(mapFromDb);
  }

  async getOverdueByUser(userId) {
    if (!userId) return [];
    const now = new Date().toISOString();
    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .is("parent_task_id", null)
      .eq("completed", false)
      .lt("due_date", now);

    if (error) {
      throw new Error(error.message);
    }

    return data.map(mapFromDb);
  }

  async getCompletedToday(userId) {
    if (!userId) return [];
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const { data, error } = await this.client
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .is("parent_task_id", null)
      .eq("completed", true)
      .gte("updated_at", startOfDay.toISOString())
      .lt("updated_at", endOfDay.toISOString());

    if (error) throw new Error(error.message);
    return data.map(mapFromDb);
  }

  async deleteByUser(userId) {
    if (!userId) return true;
    const { error } = await this.client.from(this.tableName).delete().eq("user_id", userId);
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }

  async deleteByCategory(categoryId) {
    if (!categoryId) return true;
    const { error } = await this.client.from(this.tableName).delete().eq("category_id", categoryId);
    if (error) {
      throw new Error(error.message);
    }
    return true;
  }
}

export default TaskRepository;
