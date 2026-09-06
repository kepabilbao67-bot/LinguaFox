export type LeagueTier = 'bronce' | 'plata' | 'oro' | 'zafiro' | 'diamante';

export interface LeagueTierDetails {
  id: LeagueTier;
  name: string;
  badge: string;
  color: string;
  accentColor: string;
  minXpBaseline: number;
  promotionCutoff: number; // Top N promote (e.g. 7)
  demotionCutoff: number;  // Bottom N demote (e.g. rank >= 23 of 30)
  rewardCoins: number;
}

export const LEAGUE_TIERS: Record<LeagueTier, LeagueTierDetails> = {
  bronce: {
    id: 'bronce',
    name: 'Liga Bronce',
    badge: '🥉',
    color: '#CD7F32',
    accentColor: '#DDAA77',
    minXpBaseline: 50,
    promotionCutoff: 10,
    demotionCutoff: 31, // No demotion in Bronze
    rewardCoins: 50,
  },
  plata: {
    id: 'plata',
    name: 'Liga Plata',
    badge: '🥈',
    color: '#A0AAB2',
    accentColor: '#D1D7DC',
    minXpBaseline: 150,
    promotionCutoff: 8,
    demotionCutoff: 25,
    rewardCoins: 100,
  },
  oro: {
    id: 'oro',
    name: 'Liga Oro',
    badge: '🥇',
    color: '#F59E0B',
    accentColor: '#FCD34D',
    minXpBaseline: 300,
    promotionCutoff: 7,
    demotionCutoff: 23,
    rewardCoins: 200,
  },
  zafiro: {
    id: 'zafiro',
    name: 'Liga Zafiro',
    badge: '💎',
    color: '#3B82F6',
    accentColor: '#93C5FD',
    minXpBaseline: 500,
    promotionCutoff: 5,
    demotionCutoff: 21,
    rewardCoins: 350,
  },
  diamante: {
    id: 'diamante',
    name: 'Liga Diamante',
    badge: '👑',
    color: '#EC4899',
    accentColor: '#F472B6',
    minXpBaseline: 800,
    promotionCutoff: 3,
    demotionCutoff: 20,
    rewardCoins: 600,
  },
};

export const LEAGUE_ORDER: LeagueTier[] = ['bronce', 'plata', 'oro', 'zafiro', 'diamante'];

export interface LeagueParticipant {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  isUser: boolean;
  rank: number;
  countryCode: string;
}

export interface LeagueDivision {
  weekKey: string;
  tier: LeagueTier;
  participants: LeagueParticipant[];
  endsAt: string;
  userRank: number;
}

export interface LeagueOutcome {
  rank: number;
  totalParticipants: number;
  action: 'ascenso' | 'permanencia' | 'descenso';
  currentTier: LeagueTier;
  nextTier: LeagueTier;
  xp: number;
  rewardCoins: number;
  message: string;
}
