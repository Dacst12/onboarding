import api from './axios'
import type { AuthResponse, LoginCredentials } from '../types/auth'

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>('/auth/login', credentials)
  return data
}

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout')
}