import { apiClient } from './client'
import type { ChangePasswordRequest, ResetPasswordRequest } from '@/types'

export async function changeMyPassword(data: ChangePasswordRequest): Promise<void> {
  await apiClient.put('/api/users/me/password', data)
}

export async function resetUserPasswordByEmail(data: ResetPasswordRequest): Promise<void> {
  await apiClient.put('/api/users/password/reset', data)
}