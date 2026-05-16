import api from './axios'
import { Survey, SurveyForm } from '../types/survey'

export const getSurveys = async (): Promise<Survey[]> => {
  const { data } = await api.get<Survey[]>('/surveys')
  return data
}

export const getMySurveys = async (): Promise<Survey[]> => {
  const { data } = await api.get<Survey[]>('/surveys/me')
  return data
}

export const getSurveyById = async (id: number): Promise<Survey> => {
  const { data } = await api.get<Survey>(`/surveys/${id}`)
  return data
}

export const createSurvey = async (payload: SurveyForm): Promise<Survey> => {
  const { data } = await api.post<Survey>('/surveys', payload)
  return data
}