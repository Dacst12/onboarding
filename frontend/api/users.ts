import api from './axios'
import { Employee } from '../types/user'

export const getMe = async (): Promise<Employee> => {
  const { data } = await api.get<Employee>('/users/me')
  return data
}

export const getUsers = async (): Promise<Employee[]> => {
  const { data } = await api.get<Employee[]>('/users')
  return data
}

export const getUserById = async (id: number): Promise<Employee> => {
  const { data } = await api.get<Employee>(`/users/${id}`)
  return data
}

export const updateUser = async (id: number, payload: Partial<Employee>): Promise<Employee> => {
  const { data } = await api.patch<Employee>(`/users/${id}`, payload)
  return data
}

export const deleteUser = async (id: number): Promise<void> => {
  await api.delete(`/users/${id}`)
}