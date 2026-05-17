export type MoodScore = 1 | 2 | 3 | 4 | 5

export interface Survey {
  id: number
  userId: number
  weekNumber: number
  mood: MoodScore
  clarity: MoodScore
  resources: 'yes' | 'no' | 'partial'
  comment?: string
  createdAt: string
}

export interface SurveyForm {
  mood: MoodScore
  clarity: MoodScore
  resources: 'yes' | 'no' | 'partial'
  comment?: string
}