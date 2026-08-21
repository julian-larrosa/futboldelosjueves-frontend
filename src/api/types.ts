import type { AttributeType, MatchStatus, PlayerPosition, ResultadoPartido, Role, TeamSide } from './enums';

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}

export interface PagedResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

export interface UserResponse {
  id: number;
  username: string;
  email: string;
  role: Role;
}

export interface PlayerAttributesResponse {
  playerId: number;
  attributes: PlayerAttributeResponse[];
}

export interface PlayerAttributeResponse {
  attributeType: AttributeType;
  currentValue: number;
}

export interface PlayerAttributeHistoryResponse {
  playerId: number;
  history: AttributeHistoryEntry[];
}

export interface AttributeHistoryEntry {
  id: number;
  attributeType: AttributeType;
  matchId: number;
  ratingValue: number;
}

export interface PlayerResponse {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  posicion: PlayerPosition;
  activo: boolean;
  attributes: PlayerAttributesResponse | null;
}

export interface AuthResponse {
  token: string;
  tokenType: string;
  refreshToken?: string;
  user: UserResponse;
  player: PlayerResponse | null;
  mustChangePassword: boolean;
}

export interface MatchResponse {
  id: number;
  fechaHora: string;
  lugar: string | null;
  estado: MatchStatus;
  golesEquipoA: number | null;
  golesEquipoB: number | null;
  cantidadConvocados: number;
}

export interface MatchResultResponse {
  matchId: number;
  golesEquipoA: number;
  golesEquipoB: number;
  resultado: ResultadoPartido;
}

export interface ParticipationResponse {
  id: number;
  playerId: number;
  playerNombreCompleto: string;
  teamId: number | null;
  teamSide: TeamSide | null;
  goles: number;
  jugoEfectivamente: boolean;
}

export interface RatingResponse {
  id: number;
  matchId: number;
  calificadorId: number;
  calificadorNombreCompleto: string;
  calificadoId: number;
  calificadoNombreCompleto: string;
  puntaje: number;
}

export interface RatingAverageResponse {
  playerId: number;
  nombre: string;
  apellido: string;
  promedio: number;
  cantidadCalificaciones: number;
}

export interface TopScorerResponse {
  playerId: number;
  nombre: string;
  apellido: string;
  goles: number;
  partidosJugados: number;
}

export interface TeamStandingResponse {
  playerId: number;
  nombre: string;
  apellido: string;
  partidosJugados: number;
  victorias: number;
  empates: number;
  derrotas: number;
  golesAFavor: number;
  golesEnContra: number;
  diferenciaGoles: number;
  puntos: number;
}

export interface RecentFormResponse {
  partidosJugados: number;
  victorias: number;
  derrotas: number;
  empates: number;
  goles: number;
  ratingPromedio: number | null;
  indiceForma: number | null;
}

export interface PlayerStatisticsResponse {
  playerId: number;
  partidosJugados: number;
  victorias: number;
  derrotas: number;
  empates: number;
  goles: number;
  ratingPromedio: number | null;
  porcentajeVictorias: number;
  rendimientoReciente: RecentFormResponse;
}

export interface PlayerTeamMemberResponse {
  playerId: number;
  nombre: string;
  apellido: string;
}

export interface TeamResponse {
  id: number;
  side: TeamSide;
  jugadores: PlayerTeamMemberResponse[];
  ratingPromedio: number;
}

export interface TeamBalanceResponse {
  ratingPromedioEquipoA: number;
  ratingPromedioEquipoB: number;
  diferenciaNivel: number;
}

export interface AttributeRatingResponse {
  playerId: number;
  nombre: string;
  apellido: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  posicion: PlayerPosition;
}

export interface RegisterHinchaRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface PlayerRequest {
  nombre: string;
  apellido: string;
  email: string;
  posicion: PlayerPosition;
}

export interface MatchRequest {
  fechaHora: string;
  lugar: string;
}

export interface MatchResultRequest {
  golesEquipoA: number;
  golesEquipoB: number;
}

export interface ParticipationRequest {
  playerId: number;
}

export interface MatchStatisticsUpdateRequest {
  goles: number;
  jugoEfectivamente: boolean;
}

export interface RatingRequest {
  calificadoId: number;
  puntaje: number;
}

export interface TeamAssignmentRequest {
  teamSide: TeamSide;
}

export interface AttributeRatingRequest {
  playerId: number;
  tecnica: number;
  fisico: number;
  definicion: number;
  mentalidad: number;
  pase: number;
}

export interface MatchAttributeRatingsRequest {
  ratings: AttributeRatingRequest[];
}
