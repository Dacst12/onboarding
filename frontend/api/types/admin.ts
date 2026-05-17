export interface PlanTaskData {
  id: number
  stage_id: number
  title: string
  description: string | null
  due_date: string | null
  is_completed: boolean
  completed_at: string | null
  is_system_task: boolean
  requires_confirmation: boolean
  added_by_mentor_id: number | null
  updated_at: string
}

export interface PlanStageData {
  id: number
  plan_id: number
  title: string
  order_index: number
  tasks: PlanTaskData[]
}

export interface OnboardingPlanData {
  id: number
  user_id: number
  template_id: number | null
  start_date: string
  progress_percent: number
  stages: PlanStageData[]
}

export interface TemplateTaskRead {
  id: number
  stage_id: number
  title: string
  description: string | null
  offset_days: number
}

export interface TemplateStageRead {
  id: number
  template_id: number
  title: string
  order_index: number
  tasks: TemplateTaskRead[]
}

export interface TemplatePlanRead {
  id: number
  title: string
  created_at: string
  stages: TemplateStageRead[]
}

export interface ProgressDataResponse {
  department: string
  total: number
  onboarding: number
  avg_percent: number
}

export interface MoodPointResponse {
  week: number
  avg_mood: number
}

export interface CreateAdminUserPayload {
  email: string
  password: string
  full_name: string
  role: 'new_employee' | 'mentor' | 'admin'
  position?: string | null
  department?: string | null
  mentor_id?: number | null
  telegram?: string | null
  phone?: string | null
  responsibility_tags?: string | null
  template_id?: number | null
  start_date?: string | null
}
