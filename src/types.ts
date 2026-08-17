export type NavTab = 'dashboard' | 'matches' | 'players' | 'rankings' | 'profile';

export interface PlayerAttributes {
  definicion: number;
  pase: number;
  tecnica: number;
  mentalidad: number;
  fisico: number;
}

export interface PlayerMatchHistory {
  id: string;
  date: string;
  month: string;
  day: string;
  type: 'Victoria (Local)' | 'Victoria (Visitante)' | 'Empate (Local)' | 'Empate (Visitante)' | 'Derrota (Local)' | 'Derrota (Visitante)';
  opponent: string;
  rating: number;
  isMvp?: boolean;
}

export interface Player {
  id: string;
  name: string;
  nickname?: string;
  avatar: string;
  photoHero?: string;
  roleTitle: string; // e.g. "Leyenda Activa", "Pichichi en activo"
  ovr: number;
  position: 'POR' | 'DEF' | 'MED' | 'DEL';
  matchesPlayed: number;
  goals: number;
  assists: number;
  points: number;
  rating: number;
  forma: 'up' | 'down' | 'neutral';
  victorias: number;
  empates: number;
  derrotas: number;
  attributes: PlayerAttributes;
  recentFormRatings: number[]; // e.g. [8.0, 8.2, 7.5, 8.8, 9.0]
  recentMatches: PlayerMatchHistory[];
  isCurrentUser?: boolean;
}

export interface MatchPlayerRating {
  playerId: string;
  name: string;
  initials: string;
  position: 'POR' | 'DEF' | 'MED' | 'DEL';
  ritmo: number;
  tiro: number;
  pase: number;
  defensa: number;
  global: number;
}

export interface MatchLineupItem {
  id: string;
  name: string;
  position: 'POR' | 'DEF' | 'MED' | 'DEL';
  number?: number;
}

export interface MatchScorer {
  playerId: string;
  name: string;
  playerName?: string;
  goals: number;
  avatar?: string;
  team: 'A' | 'B';
}

export interface Match {
  id: string;
  jornada: number;
  fase: string;
  date: string;
  time: string;
  location: string;
  status: 'upcoming' | 'live' | 'finished';
  teamA: {
    name: string;
    score?: number;
    color: string;
  };
  teamB: {
    name: string;
    score?: number;
    color: string;
  };
  scorers: MatchScorer[];
  lineupA: MatchLineupItem[];
  lineupB: MatchLineupItem[];
  officialRatings: MatchPlayerRating[];
  mvpName?: string;
  targetTimestamp?: number; // for countdown
}
