import type { Role } from './enums'

export interface MatchCommentResponse {
  id: number
  matchId: number
  authorId: number
  authorNombre: string
  authorRole: Role
  contenido: string
  createdAt: string
  updatedAt: string
}

export interface MatchCommentRequest {
  contenido: string
}