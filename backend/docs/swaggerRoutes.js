/**
 * @swagger
 * tags:
 *   - name: Tasks
 *     description: Gestión de tareas
 *   - name: SubTasks
 *     description: Gestión de subtareas
 *   - name: Statistics
 *     description: Estadísticas de usuario
 *   - name: Categories
 *     description: Categorías de tareas
 *   - name: Priorities
 *     description: Prioridades
 *   - name: Achievements
 *     description: Logros de usuario
 *   - name: Roles
 *     description: Roles y permisos
 *   - name: Projects
 *     description: Proyectos
 *   - name: ProjectMembers
 *     description: Miembros de proyectos
 *   - name: ProjectComments
 *     description: Comentarios en proyectos
 *   - name: CommentLikes
 *     description: Likes de comentarios
 *   - name: Users
 *     description: Usuarios
 */

/**
 * @swagger
 * /api/tasks:
 *   get:
 *     tags: [Tasks]
 *     summary: Listar tareas del usuario autenticado
 *     responses:
 *       200:
 *         description: Lista de tareas
 *   post:
 *     tags: [Tasks]
 *     summary: Crear una tarea
 *     responses:
 *       201:
 *         description: Tarea creada
 *
 * /api/tasks/{id}:
 *   put:
 *     tags: [Tasks]
 *     summary: Actualizar una tarea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarea actualizada
 *   delete:
 *     tags: [Tasks]
 *     summary: Eliminar una tarea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tarea eliminada
 *
 * /api/tasks/{id}/complete:
 *   put:
 *     tags: [Tasks]
 *     summary: Alternar estado de completado de una tarea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estado actualizado
 *
 * /api/subtasks:
 *   post:
 *     tags: [SubTasks]
 *     summary: Crear una subtarea
 *     responses:
 *       201:
 *         description: Subtarea creada
 *
 * /api/subtasks/{id}:
 *   put:
 *     tags: [SubTasks]
 *     summary: Actualizar una subtarea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subtarea actualizada
 *   delete:
 *     tags: [SubTasks]
 *     summary: Eliminar una subtarea
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Subtarea eliminada
 *
 * /api/statistics:
 *   get:
 *     tags: [Statistics]
 *     summary: Obtener estadísticas del usuario
 *     responses:
 *       200:
 *         description: Datos de estadísticas
 *
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Listar categorías
 *     responses:
 *       200:
 *         description: Lista de categorías
 *   post:
 *     tags: [Categories]
 *     summary: Crear categoría
 *     responses:
 *       201:
 *         description: Categoría creada
 *
 * /api/priorities:
 *   get:
 *     tags: [Priorities]
 *     summary: Listar prioridades
 *     responses:
 *       200:
 *         description: Lista de prioridades
 *
 * /api/achievements:
 *   get:
 *     tags: [Achievements]
 *     summary: Listar logros del usuario
 *     responses:
 *       200:
 *         description: Lista de logros
 *
 * /api/roles:
 *   get:
 *     tags: [Roles]
 *     summary: Listar roles
 *     responses:
 *       200:
 *         description: Lista de roles
 *
 * /api/projects:
 *   get:
 *     tags: [Projects]
 *     summary: Listar proyectos del usuario
 *     responses:
 *       200:
 *         description: Lista de proyectos
 *   post:
 *     tags: [Projects]
 *     summary: Crear proyecto
 *     responses:
 *       201:
 *         description: Proyecto creado
 *
 * /api/projects/{id}:
 *   get:
 *     tags: [Projects]
 *     summary: Obtener proyecto por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto encontrado
 *   put:
 *     tags: [Projects]
 *     summary: Actualizar proyecto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto actualizado
 *   delete:
 *     tags: [Projects]
 *     summary: Eliminar proyecto
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Proyecto eliminado
 *
 * /api/project-members:
 *   post:
 *     tags: [ProjectMembers]
 *     summary: Agregar miembro a proyecto
 *     responses:
 *       201:
 *         description: Miembro agregado
 *
 * /api/project-members/{projectId}/{userId}:
 *   put:
 *     tags: [ProjectMembers]
 *     summary: Actualizar rol de miembro
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Rol actualizado
 *   delete:
 *     tags: [ProjectMembers]
 *     summary: Remover miembro de proyecto
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Miembro removido
 *
 * /api/project-comments:
 *   get:
 *     tags: [ProjectComments]
 *     summary: Listar comentarios de proyecto
 *     responses:
 *       200:
 *         description: Lista de comentarios
 *   post:
 *     tags: [ProjectComments]
 *     summary: Crear comentario en proyecto
 *     responses:
 *       201:
 *         description: Comentario creado
 *
 * /api/comment-likes:
 *   post:
 *     tags: [CommentLikes]
 *     summary: Dar like a un comentario
 *     responses:
 *       201:
 *         description: Like registrado
 *   delete:
 *     tags: [CommentLikes]
 *     summary: Quitar like de un comentario
 *     responses:
 *       200:
 *         description: Like removido
 *
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Listar usuarios
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *   post:
 *     tags: [Users]
 *     summary: Crear usuario (solo metadata, auth por Supabase)
 *     responses:
 *       201:
 *         description: Usuario creado
 */
