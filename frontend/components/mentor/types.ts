export interface Mentee {
  id: number
  name: string
  position: string
  department: string
  startDate: string
  completedTasks: number
  totalTasks: number
  lastSurvey: {
    week: number
    filled: boolean
    mood?: number
  }
}

export const moodColor: Record<number, string> = {
  1: '#ff4d4f',
  2: '#ff7a45',
  3: '#faad14',
  4: '#52c41a',
  5: '#13c2c2',
}

export const moodLabel: Record<number, string> = {
  1: 'Очень плохо',
  2: 'Плохо',
  3: 'Нормально',
  4: 'Хорошо',
  5: 'Отлично',
}
