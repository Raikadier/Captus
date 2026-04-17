import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';

// Mocks declarados antes de los imports de los módulos
vi.mock('../../shared/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock('../useAuth', () => ({
  useAuth: vi.fn(),
}));

import { useCourses } from '../useCourses';
import apiClient from '../../shared/api/client';
import { useAuth } from '../useAuth';

const mockSession = { access_token: 'fake-token' };

const makeCourse = (id, title = `Curso ${id}`) => ({
  id,
  title,
  professor: 'Prof. Test',
  color: '#3b82f6',
  progress: 0,
  enrolled_at: '2025-01-01',
});

describe('useCourses', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // ─── Rol estudiante ────────────────────────────────────────────────────────

  it('llama al endpoint /courses/student para usuarios con rol student', async () => {
    useAuth.mockReturnValue({
      session: mockSession,
      user: { user_metadata: { role: 'student' } },
    });
    apiClient.get.mockResolvedValueOnce({
      data: [makeCourse(1), makeCourse(2)],
    });

    const { result } = renderHook(() => useCourses());
    await act(async () => {});

    expect(apiClient.get).toHaveBeenCalledWith('/courses/student');
    expect(result.current.courses).toHaveLength(2);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  // ─── Rol profesor ──────────────────────────────────────────────────────────

  it('llama al endpoint /courses/teacher para usuarios con rol teacher', async () => {
    useAuth.mockReturnValue({
      session: mockSession,
      user: { user_metadata: { role: 'teacher' } },
    });
    apiClient.get.mockResolvedValueOnce({ data: [makeCourse(10)] });

    const { result } = renderHook(() => useCourses());
    await act(async () => {});

    expect(apiClient.get).toHaveBeenCalledWith('/courses/teacher');
    expect(result.current.courses).toHaveLength(1);
  });

  // ─── Formatos de respuesta ─────────────────────────────────────────────────

  it('maneja respuesta como array directo', async () => {
    useAuth.mockReturnValue({
      session: mockSession,
      user: { user_metadata: { role: 'student' } },
    });
    const courses = [makeCourse(1), makeCourse(2), makeCourse(3)];
    apiClient.get.mockResolvedValueOnce({ data: courses });

    const { result } = renderHook(() => useCourses());
    await act(async () => {});

    expect(result.current.courses).toHaveLength(3);
  });

  it('maneja respuesta envuelta { success, data: [...] }', async () => {
    useAuth.mockReturnValue({
      session: mockSession,
      user: { user_metadata: { role: 'student' } },
    });
    apiClient.get.mockResolvedValueOnce({
      data: { success: true, data: [makeCourse(5), makeCourse(6)] },
    });

    const { result } = renderHook(() => useCourses());
    await act(async () => {});

    expect(result.current.courses).toHaveLength(2);
  });

  it('devuelve array vacío para formato de respuesta inesperado', async () => {
    useAuth.mockReturnValue({
      session: mockSession,
      user: { user_metadata: { role: 'student' } },
    });
    apiClient.get.mockResolvedValueOnce({ data: { unexpected: 'format' } });

    const { result } = renderHook(() => useCourses());
    await act(async () => {});

    expect(result.current.courses).toEqual([]);
  });

  // ─── Sin sesión ────────────────────────────────────────────────────────────

  it('no llama a la API cuando no hay sesión', async () => {
    useAuth.mockReturnValue({ session: null, user: null });

    const { result } = renderHook(() => useCourses());
    await act(async () => {});

    expect(apiClient.get).not.toHaveBeenCalled();
    expect(result.current.loading).toBe(false);
    expect(result.current.courses).toEqual([]);
  });

  // ─── Manejo de errores ─────────────────────────────────────────────────────

  it('establece error cuando la petición falla', async () => {
    useAuth.mockReturnValue({
      session: mockSession,
      user: { user_metadata: { role: 'student' } },
    });
    apiClient.get.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useCourses());
    await act(async () => {});

    expect(result.current.error).toBe('Network error');
    expect(result.current.courses).toEqual([]);
    expect(result.current.loading).toBe(false);
  });

  // ─── refresh ───────────────────────────────────────────────────────────────

  it('refresh recarga los cursos desde la API', async () => {
    useAuth.mockReturnValue({
      session: mockSession,
      user: { user_metadata: { role: 'student' } },
    });
    apiClient.get
      .mockResolvedValueOnce({ data: [] })
      .mockResolvedValueOnce({ data: [makeCourse(1)] });

    const { result } = renderHook(() => useCourses());
    await act(async () => {});

    expect(result.current.courses).toHaveLength(0);

    await act(async () => {
      await result.current.refresh();
    });

    expect(result.current.courses).toHaveLength(1);
    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });

  // ─── createCourse ──────────────────────────────────────────────────────────

  it('createCourse llama POST /courses y refresca la lista', async () => {
    useAuth.mockReturnValue({
      session: mockSession,
      user: { user_metadata: { role: 'teacher' } },
    });
    const newCourse = makeCourse(99, 'Nuevo Curso');
    apiClient.get.mockResolvedValue({ data: [newCourse] });
    apiClient.post.mockResolvedValueOnce({ data: { success: true, data: newCourse } });

    const { result } = renderHook(() => useCourses());
    await act(async () => {});

    let createResult;
    await act(async () => {
      createResult = await result.current.createCourse({
        title: 'Nuevo Curso',
        description: 'Desc',
      });
    });

    expect(apiClient.post).toHaveBeenCalledWith('/courses', {
      title: 'Nuevo Curso',
      description: 'Desc',
    });
    expect(createResult).toMatchObject({ success: true });
  });

  // ─── Rol por defecto ───────────────────────────────────────────────────────

  it('usa student como rol por defecto cuando no hay user_metadata.role', async () => {
    useAuth.mockReturnValue({
      session: mockSession,
      user: { user_metadata: {} },
    });
    apiClient.get.mockResolvedValueOnce({ data: [] });

    const { result } = renderHook(() => useCourses());
    await act(async () => {});

    expect(apiClient.get).toHaveBeenCalledWith('/courses/student');
  });
});
