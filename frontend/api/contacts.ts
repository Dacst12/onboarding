import api from './axios'
import type { User } from '../types/user'

export const getContacts = async (search?: string): Promise<User[]> => {
  const { data } = await api.get<User[]>('/contacts', {
    params: search ? { search } : {},
  })
  return data
}
