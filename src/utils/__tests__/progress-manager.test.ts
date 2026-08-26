import { describe, it, expect, vi } from 'vitest';
import { ProgressManager } from '../progress-manager';
import { validDay, sanitizeProgress } from '../progress-storage';

describe('ProgressManager (Lógica de Bloqueo tras Corrupción)', () => {
  it('Después de corrupción, completar una lección no escribe STORAGE_KEY', async () => {
    const manager = new ProgressManager();
    const setItem = vi.fn().mockResolvedValue(undefined);
    const getItem = vi.fn().mockResolvedValue('{ json corrupto');
    
    await manager.loadProgress(getItem, setItem, 1000);
    expect(manager.isBlockedFromSaving).toBe(true);

    manager.setLessonProgress('lesson1', 2);
    expect(manager.isBlockedFromSaving).toBe(true);

    const saveSpy = vi.fn().mockResolvedValue(undefined);
    await manager.saveProgress(saveSpy);
    expect(saveSpy).not.toHaveBeenCalled(); // Demuestra que completar lección no escribe
  });

  it('Registrar un cuestionario no desbloquea el guardado', async () => {
    const manager = new ProgressManager();
    await manager.loadProgress(vi.fn().mockResolvedValue('{ error'), vi.fn(), 1000);
    
    manager.recordQuizResult('lesson1', 10, 10, 2000);
    expect(manager.isBlockedFromSaving).toBe(true);
  });

  it('Interactuar con un personaje no desbloquea el guardado', async () => {
    const manager = new ProgressManager();
    await manager.loadProgress(vi.fn().mockResolvedValue('{ error'), vi.fn(), 1000);
    
    manager.registerCharacterInteraction('char1', 'chat', 2000);
    expect(manager.isBlockedFromSaving).toBe(true);
  });

  it('Cambiar idiomas o completar onboarding no desbloquea', async () => {
    const manager = new ProgressManager();
    await manager.loadProgress(vi.fn().mockResolvedValue('{ error'), vi.fn(), 1000);
    
    manager.setLanguages('es', 'fr');
    expect(manager.isBlockedFromSaving).toBe(true);

    manager.completeOnboarding();
    expect(manager.isBlockedFromSaving).toBe(true);
  });

  it('Si falla el respaldo, los guardados posteriores siguen bloqueados', async () => {
    const manager = new ProgressManager();
    const setItemFails = vi.fn().mockRejectedValue(new Error('Storage error'));
    
    // Silenciamos console.error para no ensuciar logs de test
    const oldError = console.error;
    console.error = vi.fn();
    
    await manager.loadProgress(vi.fn().mockResolvedValue('{ error'), setItemFails, 1000);
    console.error = oldError;

    expect(manager.isBlockedFromSaving).toBe(true);
    
    const saveSpy = vi.fn();
    await manager.saveProgress(saveSpy);
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('resetProgress es la única acción que permite escribir DEFAULT_PROGRESS explícitamente', async () => {
    const manager = new ProgressManager();
    await manager.loadProgress(vi.fn().mockResolvedValue('{ error'), vi.fn(), 1000);
    expect(manager.isBlockedFromSaving).toBe(true);

    manager.resetProgress();
    expect(manager.isBlockedFromSaving).toBe(false);

    const saveSpy = vi.fn().mockResolvedValue(undefined);
    await manager.saveProgress(saveSpy);
    expect(saveSpy).toHaveBeenCalledTimes(1);
    
    // Y efectivamente escribe DEFAULT_PROGRESS (ya que estemos limpios)
    const savedData = JSON.parse(saveSpy.mock.calls[0][1]);
    expect(savedData.leccionesCompletadas).toEqual([]);
  });
});

describe('sanitizeProgress y validDay', () => {
  it('convierte fechas imposibles (2026-02-30, 2026-13-01, 2026-00-10) en null', () => {
    expect(validDay('2026-02-30')).toBeNull();
    expect(validDay('2026-13-01')).toBeNull();
    expect(validDay('2026-00-10')).toBeNull();
    
    // Demostrar también desde sanitizeProgress
    const state1 = sanitizeProgress({ ultimoDiaActivo: '2026-02-30' });
    expect(state1.ultimoDiaActivo).toBeNull();
  });

  it('acepta fechas válidas', () => {
    expect(validDay('2026-08-26')).toBe('2026-08-26');
  });
});
