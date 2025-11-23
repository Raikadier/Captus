-- 1. Modificar tabla notifications para corregir referencias y tipos
-- Primero eliminamos el constraint existente de foreign key si apunta a profiles
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_user_id_fkey;

-- Agregamos la nueva FK apuntando a users (fuente de verdad)
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.users(id)
  ON DELETE CASCADE;

-- Modificamos el constraint CHECK para incluir 'academic'
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications
  ADD CONSTRAINT notifications_type_check
  CHECK (type = ANY (ARRAY['task'::text, 'system'::text, 'reminder'::text, 'academic'::text]));


-- 2. Crear tabla de Cursos (Courses)
CREATE TABLE public.courses (
  id SERIAL PRIMARY KEY,
  teacher_id UUID NOT NULL,
  subject_id INTEGER, -- Opcional, referencia a subjects si se desea vincular
  title VARCHAR(255) NOT NULL,
  description TEXT,
  invite_code VARCHAR(50) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT courses_teacher_id_fkey FOREIGN KEY (teacher_id) REFERENCES public.users(id),
  CONSTRAINT courses_subject_id_fkey FOREIGN KEY (subject_id) REFERENCES public.subjects(id)
);


-- 3. Crear tabla de Inscripciones (Course Enrollments)
CREATE TABLE public.course_enrollments (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  student_id UUID NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT course_enrollments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE,
  CONSTRAINT course_enrollments_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE,
  -- Evitar duplicados: un estudiante solo una vez por curso
  CONSTRAINT course_enrollments_unique_student_course UNIQUE (course_id, student_id)
);


-- 4. Crear tabla de Grupos Académicos (Course Groups)
CREATE TABLE public.course_groups (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT course_groups_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE,
  CONSTRAINT course_groups_created_by_fkey FOREIGN KEY (created_by) REFERENCES public.users(id)
);


-- 5. Crear tabla de Miembros de Grupo Académico (Course Group Members)
CREATE TABLE public.course_group_members (
  id SERIAL PRIMARY KEY,
  group_id INTEGER NOT NULL,
  student_id UUID NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT course_group_members_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.course_groups(id) ON DELETE CASCADE,
  CONSTRAINT course_group_members_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id) ON DELETE CASCADE,
  -- Un estudiante no puede estar repetido en el mismo grupo
  CONSTRAINT course_group_members_unique_student_group UNIQUE (group_id, student_id)
);


-- 6. Crear tabla de Tareas Académicas (Course Assignments)
CREATE TABLE public.course_assignments (
  id SERIAL PRIMARY KEY,
  course_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date TIMESTAMP WITH TIME ZONE NOT NULL,
  is_group_assignment BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  CONSTRAINT course_assignments_course_id_fkey FOREIGN KEY (course_id) REFERENCES public.courses(id) ON DELETE CASCADE
);


-- 7. Crear tabla de Entregas (Assignment Submissions)
CREATE TABLE public.assignment_submissions (
  id SERIAL PRIMARY KEY,
  assignment_id INTEGER NOT NULL,
  student_id UUID, -- NULL si es entrega grupal (aunque opcionalmente se puede trackear quien subio)
  group_id INTEGER, -- NULL si es entrega individual
  file_url TEXT,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  graded BOOLEAN DEFAULT false,
  grade NUMERIC(5, 2), -- Ej: 100.00, 9.5
  feedback TEXT,
  CONSTRAINT assignment_submissions_assignment_id_fkey FOREIGN KEY (assignment_id) REFERENCES public.course_assignments(id) ON DELETE CASCADE,
  CONSTRAINT assignment_submissions_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.users(id),
  CONSTRAINT assignment_submissions_group_id_fkey FOREIGN KEY (group_id) REFERENCES public.course_groups(id)
);

-- Indices para mejorar performance
CREATE INDEX idx_course_enrollments_student ON public.course_enrollments(student_id);
CREATE INDEX idx_course_enrollments_course ON public.course_enrollments(course_id);
CREATE INDEX idx_course_assignments_course ON public.course_assignments(course_id);
CREATE INDEX idx_assignment_submissions_assignment ON public.assignment_submissions(assignment_id);
