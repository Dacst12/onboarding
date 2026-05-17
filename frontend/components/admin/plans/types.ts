export interface PlanTask {
  id: number
  title: string
  description: string
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
