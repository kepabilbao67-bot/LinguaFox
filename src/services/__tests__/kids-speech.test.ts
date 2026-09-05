import { describe, expect, it, vi, beforeEach } from 'vitest';
import { speakText } from '../speech';
import * as Speech from 'expo-speech';

vi.mock('expo-speech', () => ({
  speak: vi.fn(),
  stop: vi.fn(),
  isSpeakingAsync: vi.fn().mockResolvedValue(false),
}));

describe('Kids Speech & Target Language Audio', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('plays speech in target language with gentle rate 0.75 for kids', () => {
    speakText('Bonjour', { language: 'fr', rate: 0.75 });
    expect(Speech.speak).toHaveBeenCalledWith('Bonjour', expect.objectContaining({
      language: 'fr-FR',
      rate: 0.75,
    }));
  });

  it('plays speech in German target language with rate 0.75', () => {
    speakText('Guten Tag', { language: 'de', rate: 0.75 });
    expect(Speech.speak).toHaveBeenCalledWith('Guten Tag', expect.objectContaining({
      language: 'de-DE',
      rate: 0.75,
    }));
  });

  it('plays speech in Spanish target language with rate 0.75', () => {
    speakText('Hola', { language: 'es', rate: 0.75 });
    expect(Speech.speak).toHaveBeenCalledWith('Hola', expect.objectContaining({
      language: 'es-ES',
      rate: 0.75,
    }));
  });
});
