import {
  type LeagueTier,
  type LeagueDivision,
  type LeagueParticipant,
  type LeagueOutcome,
  LEAGUE_TIERS,
  LEAGUE_ORDER,
} from '../types/leagues';

// Deterministic seedable pseudo-random number generator (Mulberry32)
function createSeededRandom(seedStr: string): () => number {
  let h = 1779033703 ^ seedStr.length;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

export function getIsoWeekKey(d: Date = new Date()): string {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil((((date.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  return `${date.getUTCFullYear()}-W${String(weekNo).padStart(2, '0')}`;
}

export function getWeekEndIsoString(d: Date = new Date()): string {
  const date = new Date(d);
  const day = date.getDay();
  // In JS: 0 is Sunday, 1 is Monday, ..., 6 is Saturday
  const diffToSunday = (7 - day) % 7;
  date.setDate(date.getDate() + diffToSunday);
  date.setHours(23, 59, 59, 999);
  return date.toISOString();
}

const BOT_NAMES = [
  'Elena R.', 'Mateo G.', 'Sophie M.', 'Liam K.', 'Yuki T.',
  'Amira H.', 'Lucas B.', 'Emma W.', 'Carlos M.', 'Noah S.',
  'Chloe D.', 'Marco V.', 'Lin C.', 'Freja N.', 'Gabriel P.',
  'Hanna L.', 'Diego F.', 'Zara K.', 'Oliver J.', 'Sara A.',
  'Tariq B.', 'Maya S.', 'Leo C.', 'Camila V.', 'Arjun P.',
  'Astrid E.', 'Dmitri K.', 'Nia O.', 'Kenji S.', 'Sofia D.'
];

const BOT_AVATARS = [
  '🦊', '🦁', '🐼', '🐨', '🐯', '🦉', '🐱', '🐶', '🐺', '🦄',
  '🦅', '🐸', '🐵', '🐙', '🦋', '🐝', '🐬', '🦚', '🦔', '🐲'
];

const COUNTRY_FLAGS = ['🇪🇸', '🇬🇧', '🇫🇷', '🇩🇪', '🇮🇹', '🇵🇹', '🇺🇸', '🇲🇽', '🇯🇵', '🇧🇷', '🇨🇦', '🇦🇺'];

export function generateWeeklyDivision(
  userTier: LeagueTier = 'bronce',
  userWeeklyXp: number = 0,
  date: Date = new Date()
): LeagueDivision {
  const weekKey = getIsoWeekKey(date);
  const endsAt = getWeekEndIsoString(date);
  const tierConfig = LEAGUE_TIERS[userTier];
  const rng = createSeededRandom(`${weekKey}_${userTier}`);

  const participants: LeagueParticipant[] = [];

  // Generate 29 simulated cohort participants
  for (let i = 0; i < 29; i++) {
    const name = BOT_NAMES[i % BOT_NAMES.length];
    const avatar = BOT_AVATARS[Math.floor(rng() * BOT_AVATARS.length)];
    const country = COUNTRY_FLAGS[Math.floor(rng() * COUNTRY_FLAGS.length)];

    // XP generation distributed around the tier baseline
    const variance = (rng() * 1.6) - 0.5; // -0.5 to +1.1
    const base = tierConfig.minXpBaseline * (1 + (29 - i) * 0.08);
    const xp = Math.max(10, Math.round(base * (1 + variance * 0.4)));

    participants.push({
      id: `bot_${userTier}_${i}`,
      name,
      avatar,
      xp,
      isUser: false,
      rank: 0,
      countryCode: country,
    });
  }

  // Insert real user participant
  participants.push({
    id: 'user_player',
    name: 'Tú',
    avatar: '🦊',
    xp: userWeeklyXp,
    isUser: true,
    rank: 0,
    countryCode: '🇪🇸',
  });

  // Sort descending by XP (deterministic break on ID)
  participants.sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp;
    return a.id.localeCompare(b.id);
  });

  // Assign ranks
  let userRank = 1;
  participants.forEach((p, idx) => {
    p.rank = idx + 1;
    if (p.isUser) userRank = p.rank;
  });

  return {
    weekKey,
    tier: userTier,
    participants,
    endsAt,
    userRank,
  };
}

export function updateUserDivisionXp(
  division: LeagueDivision,
  newUserWeeklyXp: number
): LeagueDivision {
  const participants = division.participants.map(p => {
    if (p.isUser) {
      return { ...p, xp: newUserWeeklyXp };
    }
    return { ...p };
  });

  participants.sort((a, b) => {
    if (b.xp !== a.xp) return b.xp - a.xp;
    return a.id.localeCompare(b.id);
  });

  let userRank = 1;
  participants.forEach((p, idx) => {
    p.rank = idx + 1;
    if (p.isUser) userRank = p.rank;
  });

  return {
    ...division,
    participants,
    userRank,
  };
}

export function getTierProgression(
  currentTier: LeagueTier,
  action: 'ascenso' | 'permanencia' | 'descenso'
): LeagueTier {
  const currentIndex = LEAGUE_ORDER.indexOf(currentTier);
  if (action === 'ascenso') {
    return currentIndex < LEAGUE_ORDER.length - 1 ? LEAGUE_ORDER[currentIndex + 1] : currentTier;
  }
  if (action === 'descenso') {
    return currentIndex > 0 ? LEAGUE_ORDER[currentIndex - 1] : currentTier;
  }
  return currentTier;
}

export function calculateLeagueOutcome(division: LeagueDivision): LeagueOutcome {
  const user = division.participants.find(p => p.isUser);
  const rank = user?.rank ?? division.userRank;
  const total = division.participants.length;
  const currentTier = division.tier;
  const config = LEAGUE_TIERS[currentTier];

  let action: LeagueOutcome['action'] = 'permanencia';
  let message = '¡Has mantenido tu posición en la liga!';

  if (rank <= config.promotionCutoff) {
    action = 'ascenso';
    const next = getTierProgression(currentTier, 'ascenso');
    message = next !== currentTier
      ? `¡Felicidades! Has terminado en el puesto #${rank} y asciendes a ${LEAGUE_TIERS[next].name}.`
      : `¡Campeón absoluto! Mantienes la cima en ${config.name}.`;
  } else if (rank >= config.demotionCutoff && currentTier !== 'bronce') {
    action = 'descenso';
    const prev = getTierProgression(currentTier, 'descenso');
    message = `Has finalizado en el puesto #${rank}. Desciendes a ${LEAGUE_TIERS[prev].name}. ¡A por todas la próxima semana!`;
  }

  const nextTier = getTierProgression(currentTier, action);
  const rewardCoins = action === 'ascenso' ? config.rewardCoins : (action === 'permanencia' ? Math.floor(config.rewardCoins * 0.25) : 0);

  return {
    rank,
    totalParticipants: total,
    action,
    currentTier,
    nextTier,
    xp: user?.xp ?? 0,
    rewardCoins,
    message,
  };
}
