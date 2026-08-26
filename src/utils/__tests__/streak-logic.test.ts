import { describe, it, expect } from 'vitest';
import { calculateNewStreak, StreakState, getCalendarOrdinal } from '../streak-logic';

describe('Streak Logic', () => {
  it('Primer día (inicia racha en 1)', () => {
    const ts = new Date('2026-08-26T10:00:00Z').getTime();
    const initialState: StreakState = { ultimoDiaActivo: null, rachaActual: 0, ultimoTimestampActivo: null };
    
    const result = calculateNewStreak(initialState, ts, () => '2026-08-26');
    expect(result.rachaActual).toBe(1);
    expect(result.ultimoDiaActivo).toBe('2026-08-26');
    expect(result.ultimoTimestampActivo).toBe(ts);
  });

  it('Mismo día (no incrementa)', () => {
    const baseTs = new Date('2026-08-26T10:00:00Z').getTime();
    const nextTs = new Date('2026-08-26T16:00:00Z').getTime();
    
    const state = calculateNewStreak({ ultimoDiaActivo: null, rachaActual: 0, ultimoTimestampActivo: null }, baseTs, () => '2026-08-26');
    const nextState = calculateNewStreak(state, nextTs, () => '2026-08-26');

    expect(nextState.rachaActual).toBe(1); // No incrementa
    expect(nextState.ultimoDiaActivo).toBe('2026-08-26');
    expect(nextState.ultimoTimestampActivo).toBe(nextTs); // El timestamp se actualiza
  });

  it('Día consecutivo local con salto temporal grande (ej. 46-47 horas)', () => {
    const baseTs = 1000;
    const nextTs = baseTs + (46.5 * 3600 * 1000); // 46.5 horas después

    const getLocalDate = (ts: number) => ts === baseTs ? '2026-08-10' : '2026-08-11';

    const state = calculateNewStreak({ ultimoDiaActivo: null, rachaActual: 0, ultimoTimestampActivo: null }, baseTs, getLocalDate);
    const nextState = calculateNewStreak(state, nextTs, getLocalDate);

    expect(nextState.rachaActual).toBe(2);
  });

  it('Día consecutivo local con horario de verano cruzado', () => {
    const baseTs = new Date('2026-03-07T12:00:00Z').getTime();
    const nextTs = new Date('2026-03-08T12:00:00Z').getTime(); 

    const state = calculateNewStreak({ ultimoDiaActivo: null, rachaActual: 0, ultimoTimestampActivo: null }, baseTs, () => '2026-03-07');
    const nextState = calculateNewStreak(state, nextTs, () => '2026-03-08');

    expect(nextState.rachaActual).toBe(2); 
  });

  it('Día perdido (salto superior a un día reinicia a 1)', () => {
    const baseTs = new Date('2026-08-10T12:00:00Z').getTime();
    const nextTs = new Date('2026-08-12T12:00:00Z').getTime();

    const state = calculateNewStreak({ ultimoDiaActivo: null, rachaActual: 0, ultimoTimestampActivo: null }, baseTs, () => '2026-08-10');
    const nextState = calculateNewStreak(state, nextTs, () => '2026-08-12');

    expect(nextState.rachaActual).toBe(1);
  });

  it('Timestamp atrasado (trampa o fallo de reloj)', () => {
    const baseTs = new Date('2026-08-15T12:00:00Z').getTime();
    const nextTs = new Date('2026-08-14T12:00:00Z').getTime(); 

    const state = calculateNewStreak({ ultimoDiaActivo: null, rachaActual: 0, ultimoTimestampActivo: null }, baseTs, () => '2026-08-15');
    const nextState = calculateNewStreak(state, nextTs, () => '2026-08-14');

    expect(nextState.rachaActual).toBe(1);
    expect(nextState.ultimoDiaActivo).toBe(state.ultimoDiaActivo);
    expect(nextState.ultimoTimestampActivo).toBe(baseTs);
  });

  it('Fecha local atrasada por cambio de zona horaria (mismo timestamp o mayor pero cae en día calendario anterior)', () => {
    const state: StreakState = {
      ultimoDiaActivo: '2026-08-15',
      rachaActual: 3,
      ultimoTimestampActivo: new Date('2026-08-15T01:00:00Z').getTime(), 
    };
    
    const nextTs = new Date('2026-08-15T03:00:00Z').getTime(); 
    
    const nextState = calculateNewStreak(state, nextTs, () => '2026-08-14');
    
    expect(nextState.rachaActual).toBe(3);
    expect(nextState.ultimoDiaActivo).toBe('2026-08-15');
    expect(nextState.ultimoTimestampActivo).toBe(nextTs);
  });

  it('Dos actualizaciones rápidas no incrementan dos veces', () => {
    const baseTs = new Date('2026-08-10T12:00:00Z').getTime();
    const nextTs = new Date('2026-08-11T12:00:00Z').getTime();
    const concurrentTs = new Date('2026-08-11T12:00:05Z').getTime();

    const state0 = calculateNewStreak({ ultimoDiaActivo: null, rachaActual: 0, ultimoTimestampActivo: null }, baseTs, () => '2026-08-10');
    const state1 = calculateNewStreak(state0, nextTs, () => '2026-08-11');
    expect(state1.rachaActual).toBe(2);

    const state2 = calculateNewStreak(state1, concurrentTs, () => '2026-08-11');
    expect(state2.rachaActual).toBe(2); 
  });
});

describe('getCalendarOrdinal', () => {
  it('Rechaza meses fuera de 1-12 y días imposibles', () => {
    expect(getCalendarOrdinal('2026-13-01')).toBe(0);
    expect(getCalendarOrdinal('2026-00-01')).toBe(0);
    expect(getCalendarOrdinal('2026-02-30')).toBe(0); // Día inexistente normalizado por Date
    expect(getCalendarOrdinal('2026-04-31')).toBe(0);
  });

  it('Acepta fechas válidas', () => {
    expect(getCalendarOrdinal('2026-08-26')).toBeGreaterThan(0);
  });
});
