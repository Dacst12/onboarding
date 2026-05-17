export type Role = 'new_employee' | 'mentor' | 'admin'

export interface UserMentor {
  id: number
  full_name: string
}

export interface User {
  id: number
  email: string
  full_name: string
  role: Role
  position?: string | null
  department?: string | null
  telegram?: string | null
  phone?: string | null
  responsibility_tags?: string | null
  is_active: boolean
  created_at: string
  mentor_id?: number | null
  mentor?: UserMentor | null
}

export type Employee = User
