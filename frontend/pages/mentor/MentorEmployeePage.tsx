import { useState, useMemo } from 'react'
import { Row, Col, Button, Spin, Card, Tabs } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import RoadmapSidebar from '../../components/roadmap/RoadmapSidebar'
import TaskModal from '../../components/ui/TaskModal'
import MenteeHeader from '../../components/mentor/MenteeHeader'
import MenteeStageCard from '../../components/mentor/MenteeStageCard'
import EmployeeSurveyList from '../../components/admin/EmployeeSurveyList'
import { useMenteeOnboardingPlan, useUpdateMenteeTaskStatus, useMenteeUserFeedback, useMentee } from '../../api/hooks/useMentor'
import AddCustomTaskModal from '../../components/admin/AddCustomTaskModal'
import { formatDate } from '../../utils/date'
import type { ModalTask } from '../../components/ui/TaskModal'

const MentorEmployeePage = () => {
  const navigate = useNavigate()
  const { menteeId } = useParams<{ menteeId: string }>()
  const menteeIdNum = menteeId ? parseInt(menteeId) : 0

  const { data: plan, isLoading, refetch: refetchPlan } = useMenteeOnboardingPlan(menteeIdNum)
  const { data: userFeedbacks = [] } = useMenteeUserFeedback(menteeIdNum)
  const { data: menteeUser } = useMentee(menteeIdNum)
  const updateTaskStatusMutation = useUpdateMenteeTaskStatus()

  const [selectedTask, setSelectedTask] = useState<(ModalTask & { stageId?: number }) | null>(null)
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false)

  const stages = useMemo(() => {
    if (!plan) return []

    const today = new Date()

    return plan.stages.map((stage, index) => {
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
  }, [plan])

  const daysPassed = useMemo(() => {
    if (!plan) return 0
    const today = new Date()
    const startDate = new Date(plan.start_date)
    const days = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    return Math.max(0, days)
  }, [plan])

  const mentee = useMemo(() => {
    const defaultMentee = {
      id: 0,
      name: '',
      position: '',
      department: '',
      startDate: '',
      completedTasks: 0,
      totalTasks: 0,
      lastSurvey: { week: 0, filled: false },
    }

    if (!plan) return defaultMentee

    const completedTasks = plan.stages.reduce((sum, stage) => sum + stage.tasks.filter(t => t.is_completed).length, 0)
    const totalTasks = plan.stages.reduce((sum, stage) => sum + stage.tasks.length, 0)

    return {
      id: menteeIdNum,
      name: menteeUser?.full_name || '',
      position: menteeUser?.position || '',
      department: menteeUser?.department || '',
      startDate: plan.start_date ? formatDate(plan.start_date) : '',
      completedTasks,
      totalTasks,
      lastSurvey: { week: 0, filled: false },
    }
  }, [plan, menteeIdNum, menteeUser])

  const surveys = useMemo(() => {
    if (!userFeedbacks || !Array.isArray(userFeedbacks)) return []
    return userFeedbacks.map((feedback) => ({
      week: feedback.week_number,
      mood: feedback.mood,
      clarity: feedback.tasks_clear === true ? 'yes' : feedback.tasks_clear === false ? 'no' : 'partial',
      comment: feedback.wish || undefined,
      date: feedback.created_at ? formatDate(feedback.created_at) : '',
    }))
  }, [userFeedbacks])

  if (isLoading) {
    return <Spin />
  }

  if (!menteeId || !menteeIdNum) {
    navigate('/mentor')
    return null
  }


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/mentor')}
        style={{ color: '#ff6720', padding: 0, alignSelf: 'flex-start' }}
      >
        Назад
      </Button>

      <MenteeHeader {...mentee} />

      <Row gutter={24} align="stretch">
        <Col span={5}>
          <RoadmapSidebar
            name="План адаптации"
            daysPassed={daysPassed}
            totalDays={90}
            stages={stages}
          />
        </Col>
        <Col span={19}>
          <Card style={{ borderRadius: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <span style={{ fontSize: 16, fontWeight: 500 }}>План адаптации</span>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                size="small"
                style={{ background: '#ff6720', border: 'none' }}
                onClick={() => setAddTaskModalOpen(true)}
              >
                Добавить задачу
              </Button>
            </div>

            <Tabs
              items={[
                {
                  key: 'tasks',
                  label: <span style={{ fontSize: 15 }}>Задачи</span>,
                  children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                      {stages.map((stage) => (
                        <MenteeStageCard
                          key={stage.id}
                          stage={stage}
                          onTaskClick={(task) => setSelectedTask({ ...task, stageId: stage.id })}
                          onTaskToggle={(taskId, done) => {
                            updateTaskStatusMutation.mutate(
                              {
                                userId: menteeIdNum,
                                taskId,
                                isCompleted: done,
                              },
                              {
                                onSuccess: () => {
                                  refetchPlan()
                                },
                              }
                            )
                          }}
                        />
                      ))}
                    </div>
                  ),
                },
                {
                  key: 'surveys',
                  label: <span style={{ fontSize: 15 }}>Опросы</span>,
                  children: <EmployeeSurveyList surveys={surveys} />,
                },
              ]}
            />

            {plan && (
              <AddCustomTaskModal
                open={addTaskModalOpen}
                onClose={() => setAddTaskModalOpen(false)}
                onAdd={(values) => {
                  // TODO: Реализовать добавление задачи
                  console.log('Add task:', values)
                  setAddTaskModalOpen(false)
                }}
                stages={plan.stages}
              />
            )}
          </Card>
        </Col>
      </Row>

      <TaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onToggle={() => {
          if (selectedTask) {
            updateTaskStatusMutation.mutate(
              {
                userId: menteeIdNum,
                taskId: selectedTask.id,
                isCompleted: !selectedTask.done,
              },
              {
                onSuccess: () => {
                  setSelectedTask(null)
                  refetchPlan()
                },
              }
            )
          }
        }}
      />
    </div>
  )
}

export default MentorEmployeePage
