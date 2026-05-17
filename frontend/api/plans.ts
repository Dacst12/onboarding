import api from './axios'
import { Plan, Stage, Task, UserProgress } from '../types/plan'

export const getPlans = async (): Promise<Plan[]> => {
  const { data } = await api.get<Plan[]>('/plans')
  return data
}

export const getPlanById = async (id: number): Promise<Plan> => {
  const { data } = await api.get<Plan>(`/plans/${id}`)
  return data
}

export const createPlan = async (payload: Partial<Plan>): Promise<Plan> => {
  const { data } = await api.post<Plan>('/plans', payload)
  return data
}

export const updatePlan = async (id: number, payload: Partial<Plan>): Promise<Plan> => {
  const { data } = await api.patch<Plan>(`/plans/${id}`, payload)
  return data
}

export const deletePlan = async (id: number): Promise<void> => {
  await api.delete(`/plans/${id}`)
}

export const createStage = async (payload: Partial<Stage>): Promise<Stage> => {
  const { data } = await api.post<Stage>('/stages', payload)
  return data
}

export const updateStage = async (id: number, payload: Partial<Stage>): Promise<Stage> => {
  const { data } = await api.patch<Stage>(`/stages/${id}`, payload)
  return data
}

export const deleteStage = async (id: number): Promise<void> => {
  await api.delete(`/stages/${id}`)
}

export const createTask = async (payload: Partial<Task>): Promise<Task> => {
  const { data } = await api.post<Task>('/tasks', payload)
  return data
}

export const updateTask = async (id: number, payload: Partial<Task>): Promise<Task> => {
  const { data } = await api.patch<Task>(`/tasks/${id}`, payload)
  return data
}

export const deleteTask = async (id: number): Promise<void> => {
  await api.delete(`/tasks/${id}`)
}

export const getMyProgress = async (): Promise<UserProgress> => {
  const { data } = await api.get<UserProgress>('/progress/me')
  return data
}

export const completeTask = async (taskId: number): Promise<void> => {
  await api.post(`/progress/tasks/${taskId}/complete`)
}