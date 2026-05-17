import api from './axios'
import type { User } from '../types/user'
import type {
  OnboardingPlanData,
  TemplatePlanRead,
  ProgressDataResponse,
  MoodPointResponse,
  CreateAdminUserPayload,
} from './types/admin'

// Пользователи
export const getAdminUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/admin/users')
  return data
}

export const getAdminUser = async (userId: number): Promise<User> => {
  const { data } = await api.get<User>(`/admin/users/${userId}`)
  return data
}

export const updateAdminUser = async (
  userId: number,
  payload: Partial<User>
): Promise<User> => {
  const { data } = await api.patch<User>(`/admin/users/${userId}`, payload)
  return data
}

export const createAdminUser = async (
  payload: CreateAdminUserPayload
): Promise<User> => {
  const { data } = await api.post<User>('/admin/users', payload)
  return data
}

export const deactivateAdminUser = async (userId: number): Promise<void> => {
  await api.delete(`/admin/users/${userId}`)
}

export const getMenteeOnboardingPlan = async (
  userId: number
): Promise<OnboardingPlanData> => {
  const { data } = await api.get<OnboardingPlanData>(
    `/mentor/mentees/${userId}/plan`
  )
  return data
}

export const getTemplatePlans = async (): Promise<TemplatePlanRead[]> => {
  const { data } = await api.get<TemplatePlanRead[]>('/admin/templates')
  return data
}

export const getTemplatePlan = async (
  templateId: number
): Promise<TemplatePlanRead> => {
  const { data } = await api.get<TemplatePlanRead>(
    `/admin/templates/${templateId}`
  )
  return data
}

export const createTemplatePlan = async (payload: {
  title: string
}): Promise<TemplatePlanRead> => {
  const { data } = await api.post<TemplatePlanRead>('/admin/templates', payload)
  return data
}

export const updateTemplatePlan = async (
  templateId: number,
  payload: Partial<{ title: string }>
): Promise<TemplatePlanRead> => {
  const { data } = await api.put<TemplatePlanRead>(
    `/admin/templates/${templateId}`,
    payload
  )
  return data
}

export const deleteTemplatePlan = async (templateId: number): Promise<void> => {
  await api.delete(`/admin/templates/${templateId}`)
}

// Стадии и задачи шаблонов
export const addTemplateStage = async (
  templateId: number,
  payload: { title: string; order_index: number }
): Promise<void> => {
  await api.post(`/admin/templates/${templateId}/stages`, payload)
}

export const updateTemplateStage = async (
  templateId: number,
  stageId: number,
  payload: { title?: string; order_index?: number }
): Promise<void> => {
  await api.put(`/admin/templates/${templateId}/stages/${stageId}`, payload)
}

export const deleteTemplateStage = async (
  templateId: number,
  stageId: number
): Promise<void> => {
  await api.delete(`/admin/templates/${templateId}/stages/${stageId}`)
}

export const addTemplateTask = async (
  stageId: number,
  payload: {
    title: string
    description?: string
    offset_days: number
  }
): Promise<void> => {
  await api.post(`/admin/templates/stages/${stageId}/tasks`, payload)
}

export const updateTemplateTask = async (
  stageId: number,
  taskId: number,
  payload: {
    title?: string
    description?: string
    offset_days?: number
  }
): Promise<void> => {
  await api.put(`/admin/templates/stages/${stageId}/tasks/${taskId}`, payload)
}

export const deleteTemplateTask = async (
  stageId: number,
  taskId: number
): Promise<void> => {
  await api.delete(`/admin/templates/stages/${stageId}/tasks/${taskId}`)
}

export const getProgressAnalytics = async (): Promise<
  ProgressDataResponse[]
> => {
  const { data } = await api.get<ProgressDataResponse[]>(
    '/admin/analytics/progress'
  )
  return data
}

export const getMoodAnalytics = async (): Promise<
  Record<string, MoodPointResponse[]>
> => {
  const { data } = await api.get<Record<string, MoodPointResponse[]>>(
    '/admin/analytics/mood'
  )
  return data
}

// Справочники
export const getMentors = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>('/admin/users?role=mentor')
  return data
}

export const getDepartments = async (): Promise<string[]> => {
  const users = await getAdminUsers()
  const departments = new Set(
    users.map((u) => u.department).filter((d): d is string => Boolean(d))
  )
  return Array.from(departments).sort()
}

export const getTemplatePlanNames = async (): Promise<
  Array<{ id: number; title: string }>
> => {
  const { data } = await api.get<TemplatePlanRead[]>('/admin/templates')
  return data.map((t) => ({ id: t.id, title: t.title }))
}

// Задачи
export const updateTaskStatus = async (
  userId: number,
  taskId: number,
  isCompleted: boolean
): Promise<void> => {
  await api.patch(`/mentor/mentees/${userId}/tasks/${taskId}/status`, {
    is_completed: isCompleted,
  })
}

// Обратная связь
export const getLastFeedback = async (userId: number): Promise<{ mood: number | null }> => {
  const { data } = await api.get<{ mood: number | null }>(`/admin/users/${userId}/last-feedback`)
  return data
}

export interface UserFeedback {
  week_number: number
  mood: number
  tasks_clear: boolean | null
  wish: string | null
  created_at: string | null
}

export const getUserFeedback = async (userId: number): Promise<UserFeedback[]> => {
  const { data } = await api.get<UserFeedback[]>(`/admin/users/${userId}/feedback`)
  return data
}

// Добавление кастомных задач в план
export const addTaskToMentee = async (
  userId: number,
  stageId: number,
  payload: {
    title: string
    description?: string
    due_date: string
  }
): Promise<void> => {
  await api.post(`/mentor/mentees/${userId}/tasks`, {
    stage_id: stageId,
    ...payload,
  })
}

// Удаление задачи
export const deleteTaskFromMentee = async (
  userId: number,
  taskId: number
): Promise<void> => {
  await api.delete(`/mentor/mentees/${userId}/tasks/${taskId}`)
}

// Настройки опросов
export const getSurveySettings = async (): Promise<{
  enabled: boolean
  frequency: string
  day_of_week: string
}> => {
  const { data } = await api.get('/admin/analytics/survey-settings')
  return data
}

export const updateSurveySettings = async (payload: {
  enabled: boolean
  frequency: string
  day_of_week: string
}): Promise<{
  enabled: boolean
  frequency: string
  day_of_week: string
}> => {
  const { data } = await api.patch('/admin/analytics/survey-settings', payload)
  return data
}
