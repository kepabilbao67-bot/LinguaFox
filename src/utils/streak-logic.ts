export interface StreakState {
  ultimoDiaActivo: string | null;
  rachaActual: number;
  ultimoTimestampActivo: number | null;
}

// Devuelve una cadena YYYY-MM-DD usando la fecha local
export function getLocalDateKey(timestamp: number = Date.now()): string {
  const d = new Date(timestamp);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getLocalDateString(timestamp: number): string {
  return getLocalDateKey(timestamp);
}

// Devuelve el "día ordinal" de calendario absoluto. Ignora la hora.
// Rechaza meses inválidos, días inválidos o fechas que se normalizan silenciosamente.
export function getCalendarOrdinal(dateStr: string): number {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return 0;
  
  const [year, month, day] = dateStr.split('-').map(Number);
  
  // Meses 1 a 12
  if (month < 1 || month > 12) return 0;
  // Días inicial 1 a 31 (aproximado, luego se valida exacto)
  if (day < 1 || day > 31) return 0;

  const ms = Date.UTC(year, month - 1, day);
  const strictDate = new Date(ms);
  
  // Date.UTC normaliza fechas inválidas (ej. 30 feb -> 2 de marzo).
  // Comprobamos que el año, mes y día UTC devueltos coincidan exactamente con la entrada.
  if (
    strictDate.getUTCFullYear() !== year ||
    strictDate.getUTCMonth() + 1 !== month ||
    strictDate.getUTCDate() !== day
  ) {
    return 0; // Rechazar fechas imposibles
  }

  return Math.floor(ms / 86400000);
}

export function calculateNewStreak(
  current: StreakState,
  nowTimestamp: number,
  getLocalDate: (ts: number) => string = getLocalDateString
): StreakState {
  // 1. Anomalía de tiempo retrocedido
  // Si el nuevo timestamp es menor al último registrado (el usuario viajó al pasado en su reloj),
  // conservamos la racha sin alterar el estado.
  if (
    current.ultimoTimestampActivo !== null &&
    nowTimestamp < current.ultimoTimestampActivo
  ) {
    return current;
  }

  const nowStr = getLocalDate(nowTimestamp);

  // 2. Primer día
  if (!current.ultimoDiaActivo) {
    return {
      ultimoDiaActivo: nowStr,
      rachaActual: 1,
      ultimoTimestampActivo: nowTimestamp,
    };
  }

  // 3. Mismo día (local o calendario anterior)
  // Calculamos ordinales para ver si saltamos días independientemente de las horas.
  const lastOrdinal = getCalendarOrdinal(current.ultimoDiaActivo);
  const nowOrdinal = getCalendarOrdinal(nowStr);

  if (nowOrdinal === lastOrdinal) {
    // Mismo día: actualizamos el timestamp al más reciente, pero mantenemos racha y fecha
    return {
      ultimoDiaActivo: current.ultimoDiaActivo,
      rachaActual: current.rachaActual,
      ultimoTimestampActivo: nowTimestamp,
    };
  }

  // Anomalía de cambio de zona que cause retroceso a un ordinal anterior:
  // (Ej: Volar a Japón, jugar (día 15), volver a USA, jugar (día 14)).
  if (nowOrdinal < lastOrdinal) {
    return {
      ultimoDiaActivo: current.ultimoDiaActivo,
      rachaActual: current.rachaActual,
      ultimoTimestampActivo: Math.max(current.ultimoTimestampActivo ?? 0, nowTimestamp),
    };
  }

  // 4. Día consecutivo
  if (nowOrdinal === lastOrdinal + 1) {
    return {
      ultimoDiaActivo: nowStr,
      rachaActual: current.rachaActual + 1,
      ultimoTimestampActivo: nowTimestamp,
    };
  }

  // 5. Salto superior a un día (racha rota)
  return {
    ultimoDiaActivo: nowStr,
    rachaActual: 1,
    ultimoTimestampActivo: nowTimestamp,
  };
}
