import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  fetchTutorReply,
  INITIAL_TUTOR_SUGGESTIONS,
  createPedagogicalCorrection,
  createFullPedagogicalCorrection,
} from '../tutor-reply';

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

  describe('Pedagogical Rules Integrity (18 Rules)', () => {
    const cases = [
      { input: 'i goed to school', expectedSub: 'I went', cat: 'verb-tense' },
      { input: 'i am agree with you', expectedSub: 'I agree', cat: 'grammar' },
      { input: 'i have 25 years', expectedSub: 'I am 25 years old', cat: 'grammar' },
      { input: 'i no understand this', expectedSub: "I don't understand", cat: 'grammar' },
      { input: 'she have a car', expectedSub: 'She has', cat: 'grammar' },
      { input: 'he have a dog', expectedSub: 'He has', cat: 'grammar' },
      { input: 'it depend of you', expectedSub: 'depend on', cat: 'preposition' },
      { input: 'i listen music', expectedSub: 'listen to music', cat: 'preposition' },
      { input: 'the people is nice', expectedSub: 'people are', cat: 'grammar' },
      { input: 'please explain me the rule', expectedSub: 'explain to me', cat: 'preposition' },
      { input: 'i prefer tea than coffee', expectedSub: 'prefer tea to coffee', cat: 'grammar' },
      { input: 'i do a mistake', expectedSub: 'make a mistake', cat: 'vocabulary' },
      { input: 'we arrive to london', expectedSub: 'arrive in london', cat: 'preposition' },
      { input: 'we arrive to the airport', expectedSub: 'arrive at the airport', cat: 'preposition' },
      { input: 'i live here since 3 years', expectedSub: 'for 3 years', cat: 'grammar' },
      { input: 'i lose the bus', expectedSub: 'miss the bus', cat: 'vocabulary' },
      { input: 'i look forward to hear from you', expectedSub: 'look forward to hearing', cat: 'grammar' },
      { input: 'she gave me many informations', expectedSub: 'a lot of information', cat: 'vocabulary' },
    ];

    cases.forEach(({ input, expectedSub, cat }) => {
      it(`verifica regla pedagógica para: "${input}"`, () => {
        const corr = createPedagogicalCorrection(input);
        expect(corr).toBeDefined();
        expect(corr?.correctedText).toContain(expectedSub);
        expect(corr?.category).toBe(cat);
        expect(corr?.rule).toBeTypeOf('string');
        expect(corr?.rule?.length).toBeGreaterThan(0);
        expect(corr?.example).toBeTypeOf('string');
        expect(corr?.example?.length).toBeGreaterThan(0);
        expect(corr?.explanation).toBeTypeOf('string');
        expect(corr?.explanation?.length).toBeGreaterThan(0);
        expect(corr?.why).toBeTypeOf('string');
        expect(corr?.how).toBeTypeOf('string');
        expect(corr?.when).toBeTypeOf('string');
      });
    });
  });

  describe('createFullPedagogicalCorrection (Pedagogical Bridge)', () => {
    it('genera un objeto PedagogicalCorrection compatible con ErrorExplanationCard', () => {
      const fullCorr = createFullPedagogicalCorrection('i do a mistake in the exam');
      expect(fullCorr).toBeDefined();
      expect(fullCorr?.errorDetectado).toBe('i do a mistake in the exam');
      expect(fullCorr?.correccion).toContain('make a mistake');
      expect(fullCorr?.tipoError).toBe('vocabulario');
      expect(fullCorr?.explicacionPorQue).toContain('Make');
      expect(fullCorr?.explicacionComo).toBeTypeOf('string');
      expect(fullCorr?.explicacionCuando).toBeTypeOf('string');
      expect(fullCorr?.ejemplos.length).toBeGreaterThan(0);
      expect(fullCorr?.ejercicioComprobacion).toBeTypeOf('string');
      expect(fullCorr?.confianza).toBe('high');
      expect(fullCorr?.gravedad).toBe('menor');
      expect(fullCorr?.textoParaVoz).toContain('Forma correcta:');
    });

    it('devuelve undefined si la frase no tiene errores detectados', () => {
      const fullCorr = createFullPedagogicalCorrection('Good morning, I am practicing today.');
      expect(fullCorr).toBeUndefined();
    });
  });
});
