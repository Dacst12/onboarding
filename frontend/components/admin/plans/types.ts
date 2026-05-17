export interface PlanTask {
  id: number
  title: string
  description: string
  type: 'access' | 'training' | 'meeting'
  offsetDay: number
}

export interface PlanStage {
  id: number
  title: string
  tasks: PlanTask[]
}

export interface Plan {
  id: number
  name: string
  roleType: string
  stages: PlanStage[]
}

export const taskTypeLabel: Record<string, string> = {
  access: 'Выдача доступа',
  training: 'Обучение',
  meeting: 'Встреча',
}

export const taskTypeColor: Record<string, string> = {
  access: '#1677ff',
  training: '#52c41a',
  meeting: '#ff6720',
}
