import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, cleanup } from '@testing-library/react';
import { useSubTasks } from '../useSubTasks';

// Mock del cliente API
vi.mock('../../shared/api/client', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import apiClient from '../../shared/api/client';

const makeSubTask = (id, state = false) => ({
  id_SubTask: id,
  title: `Subtarea ${id}`,
  description: 'Descripción',
  state,
  endDate: '2099-01-01',
  id_Category: null,
  id_Priority: null,
});

describe('useSubTasks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // ─── Estado inicial ────────────────────────────────────────────────────────

  it('inicializa con arrays vacíos y loading false cuando taskId es null', async () => {
    const { result } = renderHook(() => useSubTasks(null));
    expect(result.current.subTasks).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('llama a GET /subtasks/task/:id al montar con un taskId válido', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: { success: true, data: [makeSubTask(1), makeSubTask(2)] },
    });

    const { result } = renderHook(() => useSubTasks(42));

    await act(async () => {});

    expect(apiClient.get).toHaveBeenCalledWith('/subtasks/task/42');
    expect(result.current.subTasks).toHaveLength(2);
    expect(result.current.loading).toBe(false);
  });

  it('maneja respuesta de error del servidor (success: false)', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: { success: false, message: 'Sin permiso' },
    });

    const { result } = renderHook(() => useSubTasks(1));
    await act(async () => {});

    expect(result.current.error).toBe('Sin permiso');
    expect(result.current.subTasks).toEqual([]);
  });

  it('maneja error de red (excepción en la petición)', async () => {
    apiClient.get.mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useSubTasks(1));
    await act(async () => {});

    expect(result.current.error).toBe('Error al cargar subtareas');
  });

  // ─── Cálculo de progreso ───────────────────────────────────────────────────

  it('calcula progreso 0% cuando no hay subtareas', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { success: true, data: [] } });
    const { result } = renderHook(() => useSubTasks(1));
    await act(async () => {});

    expect(result.current.progress).toBe(0);
    expect(result.current.completedCount).toBe(0);
    expect(result.current.totalCount).toBe(0);
  });

  it('calcula progreso 50% cuando 1 de 2 subtareas está completa', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: [makeSubTask(1, true), makeSubTask(2, false)],
      },
    });
    const { result } = renderHook(() => useSubTasks(1));
    await act(async () => {});

    expect(result.current.completedCount).toBe(1);
    expect(result.current.totalCount).toBe(2);
    expect(result.current.progress).toBe(50);
  });

  it('calcula progreso 100% cuando todas las subtareas están completas', async () => {
    apiClient.get.mockResolvedValueOnce({
      data: {
        success: true,
        data: [makeSubTask(1, true), makeSubTask(2, true), makeSubTask(3, true)],
      },
    });
    const { result } = renderHook(() => useSubTasks(1));
    await act(async () => {});

    expect(result.current.progress).toBe(100);
  });

  // ─── createSubTask ─────────────────────────────────────────────────────────

  it('createSubTask agrega la nueva subtarea al estado', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { success: true, data: [] } });
    const newSub = makeSubTask(99);
    apiClient.post.mockResolvedValueOnce({
      data: { success: true, data: newSub },
    });

    const { result } = renderHook(() => useSubTasks(5));
    await act(async () => {});

    let createResult;
    await act(async () => {
      createResult = await result.current.createSubTask({ title: 'Nueva subtarea' });
    });

    expect(createResult.success).toBe(true);
    expect(result.current.subTasks).toHaveLength(1);
    expect(result.current.subTasks[0].id_SubTask).toBe(99);
    expect(apiClient.post).toHaveBeenCalledWith('/subtasks', {
      title: 'Nueva subtarea',
      id_Task: 5,
    });
  });

  it('createSubTask retorna error cuando el servidor falla', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { success: true, data: [] } });
    apiClient.post.mockResolvedValueOnce({
      data: { success: false, message: 'Título requerido' },
    });

    const { result } = renderHook(() => useSubTasks(5));
    await act(async () => {});

    let createResult;
    await act(async () => {
      createResult = await result.current.createSubTask({ title: '' });
    });

    expect(createResult.success).toBe(false);
    expect(createResult.error).toBe('Título requerido');
    expect(result.current.subTasks).toHaveLength(0);
  });

  // ─── deleteSubTask ─────────────────────────────────────────────────────────

  it('deleteSubTask elimina la subtarea del estado local', async () => {
    const initial = [makeSubTask(1), makeSubTask(2)];
    apiClient.get.mockResolvedValueOnce({ data: { success: true, data: initial } });
    apiClient.delete.mockResolvedValueOnce({ data: { success: true } });

    const { result } = renderHook(() => useSubTasks(1));
    await act(async () => {});

    expect(result.current.subTasks).toHaveLength(2);

    await act(async () => {
      await result.current.deleteSubTask(1);
    });

    expect(result.current.subTasks).toHaveLength(1);
    expect(result.current.subTasks[0].id_SubTask).toBe(2);
  });

  // ─── toggleSubTask ─────────────────────────────────────────────────────────

  it('toggleSubTask invierte el estado de la subtarea', async () => {
    const sub = makeSubTask(10, false);
    apiClient.get.mockResolvedValueOnce({ data: { success: true, data: [sub] } });
    apiClient.put.mockResolvedValueOnce({
      data: { success: true, data: { ...sub, state: true } },
    });

    const { result } = renderHook(() => useSubTasks(7));
    await act(async () => {});

    expect(result.current.subTasks[0].state).toBe(false);

    await act(async () => {
      await result.current.toggleSubTask(10);
    });

    expect(result.current.subTasks[0].state).toBe(true);
    expect(apiClient.put).toHaveBeenCalledWith(
      '/subtasks/10',
      expect.objectContaining({ state: true })
    );
  });

  it('toggleSubTask retorna error cuando la subtarea no existe', async () => {
    apiClient.get.mockResolvedValueOnce({ data: { success: true, data: [] } });
    const { result } = renderHook(() => useSubTasks(1));
    await act(async () => {});

    let res;
    await act(async () => {
      res = await result.current.toggleSubTask(999);
    });

    expect(res.success).toBe(false);
    expect(res.error).toBe('Subtarea no encontrada');
  });

  // ─── refreshSubTasks ──────────────────────────────────────────────────────

  it('refreshSubTasks vuelve a cargar desde la API', async () => {
    apiClient.get
      .mockResolvedValueOnce({ data: { success: true, data: [] } })
      .mockResolvedValueOnce({ data: { success: true, data: [makeSubTask(5)] } });

    const { result } = renderHook(() => useSubTasks(3));
    await act(async () => {});

    expect(result.current.subTasks).toHaveLength(0);

    await act(async () => {
      await result.current.refreshSubTasks();
    });

    expect(result.current.subTasks).toHaveLength(1);
    expect(apiClient.get).toHaveBeenCalledTimes(2);
  });
});
