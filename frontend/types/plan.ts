export interface Task {
  id: number
  stageId: number
  title: string
  description?: string
  dueDays: number
  completed?: boolean
  completedAt?: string
}

export interface Stage {
  id: number
  planId: number
  title: string
  order: number
  durationDays: number
  tasks: Task[]
}

export interface Plan {
  id: number
  name: string
  roleType: string
  stages: Stage[]
  createdBy: number
  createdAt: string
}

export interface UserProgress {
  userId: number
  planId: number
  currentStageId: number
  completedTasks: number[]
  totalTasks: number
  percent: number
  startDate: string
}