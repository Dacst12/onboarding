import api from './axios'
import type { User } from '../types/user'
import type { OnboardingPlanData } from './types/admin'

export interface MenteeSummary {
  id: number
  full_name: string
  position: string | null
  progress_percent: number
  start_date: string | null
  last_feedback_available: boolean
}

export const getMentees = async (): Promise<MenteeSummary[]> => {
  const { data } = await api.get<MenteeSummary[]>('/mentor/mentees')
  return data
}

export const getMentee = async (userId: number): Promise<User> => {
  const { data } = await api.get<User>(`/mentor/mentees/${userId}`)
  return data
}

export const getMenteeOnboardingPlan = async (userId: number): Promise<OnboardingPlanData> => {
  const { data } = await api.get<OnboardingPlanData>(`/mentor/mentees/${userId}/plan`)
  return data
}

export const updateMenteeTaskStatus = async (
  userId: number,
  taskId: number,
  isCompleted: boolean
): Promise<{ detail: string }> => {
  const { data } = await api.patch<{ detail: string }>(
    `/mentor/mentees/${userId}/tasks/${taskId}/status`,
    { is_completed: isCompleted }
  )
  return data
}

export const getMenteeUserFeedback = async (userId: number): Promise<any[]> => {
  const { data } = await api.get<any[]>(`/mentor/mentees/${userId}/feedback`)
  return data
}
