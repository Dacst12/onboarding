export type Role = 'employee' | 'mentor' | 'admin'

export interface User {
  id: number
  name: string
  email: string
  role: Role
  avatar?: string
  department?: string
}

export interface Employee {
  id: number
  name: string
  email: string
  role: Role
  avatar?: string
  department: string
  team: string
  position: string
  responsibilities: string
  phone?: string
  telegram?: string
  vk?: string
  startDate: string
  mentorId?: number
}
