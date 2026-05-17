import api from './axios'
import type { AuthResponse, LoginCredentials } from '../types/auth'
import type { User } from '../types/user'

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const tokenResponse = await api.post<{ access_token: string; token_type: string }>('/auth/login', credentials)
  const token = tokenResponse.data.access_token

  const userResponse = await api.get<User>('/me', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  return {
    user: userResponse.data,
    token,
  }
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}