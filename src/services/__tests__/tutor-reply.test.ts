import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchTutorReply, INITIAL_TUTOR_SUGGESTIONS, createPedagogicalCorrection } from '../tutor-reply';

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
    expect(result?.suggestions.length).toBeGreaterThan(0);
    expect(globalThis.fetch).not.toHaveBeenCalled();
  });

  it('aplica correcciones locales conocidas (i goed -> I went)', async () => {
    const result = await fetchTutorReply('yesterday i goed to the park');
    expect(result?.correction).toBeDefined();
    expect(result?.correction?.correctedText).toBe('yesterday I went to the park');
    expect(result?.correction?.explanation).toContain('irregular');
    expect(result?.text).toContain('Good try!');
  });

  it('corrige "i am agree" a "I agree" con explicación pedagógica bilingüe', async () => {
    const result = await fetchTutorReply('yes, i am agree with you');
    expect(result?.correction).toBeDefined();
    expect(result?.correction?.correctedText).toBe('yes, I agree with you');
    expect(result?.correction?.explanation).toContain('agree');
  });

  it('corrige "i have 20 years" a "I am 20 years old"', async () => {
    const result = await fetchTutorReply('i have 25 years');
    expect(result?.correction).toBeDefined();
    expect(result?.correction?.correctedText).toBe('I am 25 years old');
  });

  it('corrige colocaciones preposicionales comunes (depend of -> depend on)', () => {
    const corr = createPedagogicalCorrection('it depend of the weather');
    expect(corr).toBeDefined();
    expect(corr?.correctedText).toBe('it depend on the weather');
    expect(corr?.explanation).toContain('depend on');
  });

  it('corrige verbos con preposiciones obligatorias (listen music -> listen to music)', () => {
    const corr = createPedagogicalCorrection('i like to listen music');
    expect(corr).toBeDefined();
    expect(corr?.correctedText).toBe('I like to listen to music');
  });

  it('corrige concordancia singular/plural (people is -> people are)', () => {
    const corr = createPedagogicalCorrection('people is very friendly here');
    expect(corr).toBeDefined();
    expect(corr?.correctedText).toBe('people are very friendly here');
  });

  it('mantiene el contrato de TutorReply cuando no hay correcciones', async () => {
    const result = await fetchTutorReply('I love pizza');
    expect(result?.correction).toBeUndefined();
    expect(result?.text).toBeTypeOf('string');
    expect(result?.suggestions.length).toBeGreaterThan(0);
  });

  it('adapta el mensaje cuando se proporciona nivel A1', async () => {
    const result = await fetchTutorReply('hello', { level: 'A1' });
    expect(result?.text).toContain('Take your time and reply in a simple sentence.');
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

  it('proporciona respuestas y sugerencias adaptadas al idioma objetivo (francés, alemán)', async () => {
    const frResult = await fetchTutorReply('bonjour', { targetLanguage: 'fr' });
    expect(frResult?.text).toContain('tuteur de français');
    expect(frResult?.suggestions[0]).toContain('très bien');

    const deResult = await fetchTutorReply('danke', { targetLanguage: 'de' });
    expect(deResult?.text).toContain('Gern geschehen!');
  });
});
