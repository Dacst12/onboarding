import { Row, Col, Spin } from 'antd'
import { useState, useMemo } from 'react'
import RoadmapSidebar from '../../components/roadmap/RoadmapSidebar'
import RoadmapStageCard from '../../components/roadmap/RoadmapStageCard'
import TaskModal from '../../components/ui/TaskModal'
import { useMyPlan } from '../../api/hooks/useEmployee'
import { useCompleteTask, useUncompleteTask } from '../../api/hooks/useEmployee'
import { formatDate } from '../../utils/date'
import type { Stage, SelectedTask } from '../../components/roadmap/types'

const RoadmapPage = () => {
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null)
  const { data: plan, isLoading } = useMyPlan()
  const completeTaskMutation = useCompleteTask()
  const uncompleteTaskMutation = useUncompleteTask()

  const stages = useMemo(() => {
    if (!plan) return []

    const today = new Date()

    const stagesWithStatus = plan.stages.map((stage, index) => {
      let status: 'done' | 'current' | 'locked' = 'locked'

      const allTasksDone = stage.tasks.every((t) => t.is_completed)
      const hasStartedTask = stage.tasks.some((t) => t.is_completed)

      if (allTasksDone) {
        status = 'done'
      } else if (hasStartedTask || index === 0) {
        status = 'current'
      }

      return {
        id: stage.id,
        title: stage.title,
        durationDays: 30,
        status,
        tasks: stage.tasks.map((task) => {
          const dueDate = task.due_date ? new Date(task.due_date) : null
          const isOverdue = dueDate ? dueDate < today && !task.is_completed : false

          return {
            id: task.id,
            title: task.title,
            description: task.description || '',
            done: task.is_completed,
            due: task.due_date ? formatDate(task.due_date) : '',
            overdue: isOverdue,
          }
        }),
      }
    })

    return stagesWithStatus.map((stage, index) => {
      if (stage.status === 'locked' && index > 0) {
        const prevStage = stagesWithStatus[index - 1]
        if (prevStage.status === 'done') {
          return { ...stage, status: 'current' as const }
        }
      }
      return stage
    }) as Stage[]
  }, [plan])

  const daysPassed = useMemo(() => {
    if (!plan) return 0
    const today = new Date()
    const startDate = new Date(plan.start_date)
    const days = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, days)
  }, [plan])

  const handleToggle = async () => {
    if (!selectedTask || selectedTask.stageStatus === 'locked') return

    try {
      if (selectedTask.done) {
        await uncompleteTaskMutation.mutateAsync(selectedTask.id)
      } else {
        await completeTaskMutation.mutateAsync(selectedTask.id)
      }
      setSelectedTask((prev) => (prev ? { ...prev, done: !prev.done } : null))
    } catch (error) {
      console.error('Ошибка при изменении статуса задачи:', error)
    }
  }

  const handleTaskToggle = async (taskId: number, stageStatus: 'done' | 'current' | 'locked') => {
    if (stageStatus === 'locked') return

    const task = stages
      .flatMap((s) => s.tasks.map((t) => ({ ...t, stageStatus: s.status })))
      .find((t) => t.id === taskId)

    if (!task) return

    try {
      if (task.done) {
        await uncompleteTaskMutation.mutateAsync(taskId)
      } else {
        await completeTaskMutation.mutateAsync(taskId)
      }
    } catch (error) {
      console.error('Ошибка при изменении статуса задачи:', error)
    }
  }

  if (isLoading) {
    return <Spin />
  }

  return (
    <Row gutter={24} align="stretch">
      <Col span={5}>
        <RoadmapSidebar
          name={plan?.id ? 'План адаптации' : ''}
          daysPassed={daysPassed}
          totalDays={90}
          stages={stages}
          onTaskToggle={handleTaskToggle}
        />
      </Col>
      <Col span={19}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {stages.map((stage) => (
            <RoadmapStageCard
              key={stage.id}
              stage={stage}
              onTaskClick={setSelectedTask}
              onTaskToggle={handleTaskToggle}
            />
          ))}
        </div>
      </Col>
      <TaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onToggle={handleToggle}
        disabled={selectedTask?.stageStatus === 'locked'}
        disabledText="Этап ещё не начат"
      />
    </Row>
  )
}

export default RoadmapPage
