export interface ProgressData {
  department: string
  total: number
  onboarding: number
  avgPercent: number
}

export interface MoodPoint {
  week: number
  avgMood: number
}

export const departmentColor: Record<string, string> = {
  Разработка: '#1677ff',
  Дизайн: '#eb2f96',
  Продукт: '#722ed1',
  Инфраструктура: '#52c41a',
  HR: '#ff6720',
}

export const getDepartmentColor = (department: string) =>
  departmentColor[department] ?? '#ff6720'

export const moodLabel = (value: number) => {
  if (value >= 4.5) return 'Отлично'
  if (value >= 3.5) return 'Хорошо'
  if (value >= 2.5) return 'Нормально'
  if (value >= 1.5) return 'Плохо'
  return 'Очень плохо'
}
