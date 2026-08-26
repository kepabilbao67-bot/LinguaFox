import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchTutorReply, INITIAL_TUTOR_SUGGESTIONS } from '../tutor-reply';

beforeEach(() => {
  globalThis.fetch = vi.fn() as any;
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('fetchTutorReply (Local)', () => {
  it('devuelve undefined para texto vacío o solo espacios', async () => {
    const result = await fetchTutorReply('   ');
    expect(result).toBeUndefined();
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('devuelve un TutorReply válido para texto normal', async () => {
    const result = await fetchTutorReply('hello fox');
    expect(result).toBeDefined();
    expect(result?.text).toBeTypeOf('string');
    expect(result?.suggestions).toBeInstanceOf(Array);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('aplica correcciones locales conocidas (i goed -> I went)', async () => {
    const result = await fetchTutorReply('yesterday i goed to the park');
    expect(result?.correction).toBeDefined();
    expect(result?.correction?.correctedText).toBe('yesterday I went to the park');
    expect(result?.correction?.explanation).toContain('irregular');
    expect(result?.text).toContain('Good try!');
  });

  it('mantiene el contrato de TutorReply cuando no hay correcciones', async () => {
    const result = await fetchTutorReply('I love pizza');
    expect(result?.correction).toBeUndefined();
    expect(result?.text).toBeTypeOf('string');
    expect(result?.suggestions.length).toBeGreaterThan(0);
  });

  it('asegura que las sugerencias iniciales existen y no están vacías', () => {
    expect(INITIAL_TUTOR_SUGGESTIONS).toBeDefined();
    expect(INITIAL_TUTOR_SUGGESTIONS.length).toBeGreaterThan(0);
    expect(INITIAL_TUTOR_SUGGESTIONS[0]).toBeTypeOf('string');
  });

  it('no utiliza la red (fetch) bajo ninguna circunstancia', async () => {
    await fetchTutorReply('hello');
    await fetchTutorReply('i am agree');
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });
});
