import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ShadowBufferService } from '../shadowBuffer';
import { createMMKV } from 'react-native-mmkv';

// Simulamos react-native-mmkv
vi.mock('react-native-mmkv', () => {
  const store: Record<string, string> = {};
  const mockStorageInstance = {
    getString: vi.fn((key: string) => store[key]),
    set: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    clearAll: vi.fn(() => {
      for (const key of Object.keys(store)) {
        delete store[key];
      }
    }),
  };
  return {
    createMMKV: vi.fn(() => mockStorageInstance),
  };
});

describe('ShadowBufferService', () => {
  let mockStorage: any;

  beforeEach(() => {
    mockStorage = createMMKV();
    mockStorage.clearAll();
    vi.clearAllMocks();
    // Restablecer el estado interno del singleton simulando un reinicio de módulo
    // Esto se logra asegurando que la flag isSyncingActive esté inactiva.
    // Como no podemos exportarla para testing directamente, la reseteamos esperando
    // que syncPendingLessons termine, aunque los mocks limpian el estado.
  });

  it('Guarda varias lecciones offline con IDs únicos (queueId)', () => {
    ShadowBufferService.saveLessonOffline('lesson1', { data: 1 });
    ShadowBufferService.saveLessonOffline('lesson2', { data: 2 });

    const buffer = ShadowBufferService.getBuffer();
    expect(buffer).toHaveLength(2);
    expect(buffer[0].queueId).toBeDefined();
    expect(buffer[1].queueId).toBeDefined();
    expect(buffer[0].queueId).not.toBe(buffer[1].queueId);
    expect(buffer[0].lessonId).toBe('lesson1');
  });

  it('Migra entradas antiguas (id -> lessonId) y genera queueId', () => {
    mockStorage.set(
      'system.shadowBuffer.lessons',
      JSON.stringify([{ id: 'old_format_lesson', payload: {}, timestamp: 100, status: 'pending' }])
    );
    const buffer = ShadowBufferService.getBuffer();
    expect(buffer).toHaveLength(1);
    expect(buffer[0].lessonId).toBe('old_format_lesson');
    expect((buffer[0] as any).id).toBeUndefined();
    expect(buffer[0].queueId).toBeDefined();
    
    // Verificar que se haya guardado el nuevo formato en el almacenamiento
    const inStorage = JSON.parse(mockStorage.getString('system.shadowBuffer.lessons')!);
    expect(inStorage[0].lessonId).toBe('old_format_lesson');
  });

  it('Maneja JSON corrupto devolviendo vacío y guarda copia de seguridad', () => {
    mockStorage.set('system.shadowBuffer.lessons', '{ corrupt json');
    const buffer = ShadowBufferService.getBuffer();
    expect(buffer).toEqual([]);

    const setCalls = mockStorage.set.mock.calls;
    const backupCall = setCalls.find((call: any[]) => call[0].startsWith('system.shadowBuffer.lessons.corrupted_'));
    expect(backupCall).toBeDefined();
    expect(backupCall[1]).toBe('{ corrupt json');
  });

  it('Sincronización exitosa elimina solo la lección confirmada y entrega queueId al sincronizador', async () => {
    ShadowBufferService.saveLessonOffline('l1', { a: 1 });
    const bufferBefore = ShadowBufferService.getBuffer();
    const qId = bufferBefore[0].queueId;

    const syncFn = vi.fn().mockResolvedValue(true);
    await ShadowBufferService.syncPendingLessons(syncFn);

    expect(syncFn).toHaveBeenCalledTimes(1);
    expect(syncFn.mock.calls[0][0].queueId).toBe(qId);
    expect(syncFn.mock.calls[0][0].lessonId).toBe('l1');
    expect(ShadowBufferService.getBuffer()).toHaveLength(0);
  });

  it('Fallo remoto conserva el elemento y lo marca como failed', async () => {
    ShadowBufferService.saveLessonOffline('l1', { a: 1 });
    const syncFn = vi.fn().mockResolvedValue(false);

    await ShadowBufferService.syncPendingLessons(syncFn);

    expect(syncFn).toHaveBeenCalledTimes(1);
    const buffer = ShadowBufferService.getBuffer();
    expect(buffer).toHaveLength(1);
    expect(buffer[0].status).toBe('failed');
  });

  it('Una lección añadida durante un await no desaparece (Race Condition resuelta)', async () => {
    ShadowBufferService.saveLessonOffline('old_lesson', { a: 1 });

    const syncFn = vi.fn().mockImplementation(async () => {
      ShadowBufferService.saveLessonOffline('new_lesson_during_sync', { a: 2 });
      return true;
    });

    await ShadowBufferService.syncPendingLessons(syncFn);

    const buffer = ShadowBufferService.getBuffer();
    expect(buffer).toHaveLength(1);
    expect(buffer[0].lessonId).toBe('new_lesson_during_sync');
    expect(buffer[0].status).toBe('pending');
  });

  it('Recupera elementos que se quedaron en estado syncing tras un cierre de app', async () => {
    mockStorage.set(
      'system.shadowBuffer.lessons',
      JSON.stringify([{ queueId: 'q1', lessonId: 'l1', status: 'syncing', timestamp: 123 }])
    );

    const syncFn = vi.fn().mockResolvedValue(true);
    await ShadowBufferService.syncPendingLessons(syncFn);

    expect(syncFn).toHaveBeenCalledTimes(1);
    expect(ShadowBufferService.getBuffer()).toHaveLength(0);
  });

  it('Evita dos ejecuciones simultáneas de syncPendingLessons', async () => {
    ShadowBufferService.saveLessonOffline('l1', { a: 1 });
    ShadowBufferService.saveLessonOffline('l2', { a: 2 });


    const syncFn1 = vi.fn().mockImplementation(async () => {
      // Bloquear artificialmente
      await new Promise((r) => setTimeout(r, 50));
      return true;
    });
    const syncFn2 = vi.fn().mockResolvedValue(true);

    const p1 = ShadowBufferService.syncPendingLessons(syncFn1);
    const p2 = ShadowBufferService.syncPendingLessons(syncFn2); // Debe ser ignorado por isSyncingActive

    await Promise.all([p1, p2]);

    expect(syncFn1).toHaveBeenCalled();
    expect(syncFn2).not.toHaveBeenCalled();
  });
});
