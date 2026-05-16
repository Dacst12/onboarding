import type { ModalTask } from '../ui/TaskModal'

export interface SelectedTask extends ModalTask {
  stageStatus: 'done' | 'current' | 'locked'
}

export interface Task {
  id: number
  title: string
  description?: string
  done: boolean
  due: string
  overdue?: boolean
}

export interface Stage {
  id: number
  title: string
  durationDays: number
  status: 'done' | 'current' | 'locked'
  tasks: Task[]
}

export const statusConfig = {
  done: {
    color: '#52c41a',
    bg: '#f6ffed',
    border: '#b7eb8f',
    label: 'Завершён',
  },
  current: {
    color: '#ff6720',
    bg: '#fff3ee',
    border: '#ffd0b5',
    label: 'В процессе',
  },
  locked: {
    color: '#bbb',
    bg: '#fafafa',
    border: '#f0f0f0',
    label: 'Не начат',
  },
}
