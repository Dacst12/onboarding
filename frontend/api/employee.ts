import api from './axios'
import type { OnboardingPlanData } from './types/admin'

export const getMyPlan = async (): Promise<OnboardingPlanData> => {
  const { data } = await api.get<OnboardingPlanData>('/me/plan')
  return data
}

export const getLastFeedback = async (): Promise<{ mood: number | null; week_number: number | null }> => {
  const { data } = await api.get<{ mood: number | null; week_number: number | null }>('/me/feedback/last')
  return data
}

export const getFeedbackAvailable = async (): Promise<{ available: boolean }> => {
  const { data } = await api.get<{ available: boolean }>('/me/feedback/available')
  return data
}

export const completeTask = async (taskId: number): Promise<{ detail: string }> => {
  const { data } = await api.patch<{ detail: string }>(`/me/tasks/${taskId}/complete`)
  return data
}

export const uncompleteTask = async (taskId: number): Promise<{ detail: string }> => {
  const { data } = await api.patch<{ detail: string }>(`/me/tasks/${taskId}/uncomplete`)
  return data
}

export interface FeedbackPayload {
  week_number: number
  mood: number
  tasks_clear: boolean
  wish?: string
}

export interface FeedbackResponse {
  id: number
  user_id: number
  week_number: number
  mood: number
  clarity: string
  comment: string | null
  created_at: string
}

export const createFeedback = async (payload: FeedbackPayload): Promise<FeedbackResponse> => {
  const { data } = await api.post<FeedbackResponse>('/me/feedback', payload)
  return data
}
