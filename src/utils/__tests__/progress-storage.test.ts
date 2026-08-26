import { describe, it, expect, vi } from 'vitest';
import { safeLoadProgress, STORAGE_KEY } from '../progress-storage';

describe('Progress Storage (JSON Corruption Handling)', () => {
  it('Carga correctamente un JSON válido sin corromper', async () => {
    const getItem = vi.fn().mockResolvedValue('{"leccionesCompletadas":[]}');
    const setItem = vi.fn().mockResolvedValue(undefined);
    
    const result = await safeLoadProgress(getItem, setItem, 1000);
    
    expect(result.isCorrupted).toBe(false);
    expect(result.rawData).toBe('{"leccionesCompletadas":[]}');
    expect(setItem).not.toHaveBeenCalled();
  });

  it('Detecta JSON corrupto respaldado y NO devuelve rawData (JSON corrupto respaldado)', async () => {
    const getItem = vi.fn().mockResolvedValue('{ json corrupto');
    const setItem = vi.fn().mockResolvedValue(undefined);
    
    const result = await safeLoadProgress(getItem, setItem, 12345);
    
    expect(result.isCorrupted).toBe(true);
    expect(result.rawData).toBeNull();
    // JSON corrupto respaldado
    expect(setItem).toHaveBeenCalledWith(`${STORAGE_KEY}_corrupted_12345`, '{ json corrupto');
  });

  it('Fallo al crear el respaldo no crashea (captura error y marca isCorrupted)', async () => {
    const getItem = vi.fn().mockResolvedValue('{ json corrupto');
    const setItem = vi.fn().mockRejectedValue(new Error('Storage full'));
    
    const originalConsoleError = console.error;
    console.error = vi.fn();
    
    const result = await safeLoadProgress(getItem, setItem, 999);
    
    expect(result.isCorrupted).toBe(true);
    expect(result.rawData).toBeNull();
    expect(console.error).toHaveBeenCalled();
    
    console.error = originalConsoleError;
  });
});
