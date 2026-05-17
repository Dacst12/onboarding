import { useMemo, useState } from 'react'
import { Row, Col, Button, Tabs, message, Card, Spin } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeftOutlined, PlusOutlined } from '@ant-design/icons'
import EmployeeProfileCard from '../../components/admin/EmployeeProfileCard'
import EmployeeProgressCard from '../../components/admin/EmployeeProgressCard'
import EmployeeDataCard from '../../components/admin/EmployeeDataCard'
import EmployeeEmptyPlan from '../../components/admin/EmployeeEmptyPlan'
import EmployeeTaskList from '../../components/admin/EmployeeTaskList'
import EmployeeSurveyList from '../../components/admin/EmployeeSurveyList'
import AddCustomTaskModal from '../../components/admin/AddCustomTaskModal'
import { useAdminUsers, useMenteeOnboardingPlan, useUpdateAdminUser, useTemplatePlans, useUpdateTaskStatus, useAddTaskToMentee, useDeleteTaskFromMentee, useUserFeedback } from '../../api/hooks/useAdmin'
import { formatDate } from '../../utils/date'
import type { AdminTask } from '../../components/admin/EmployeeTaskList'
import type { User } from '../../types/user'

const AdminEmployeePage = () => {
  const navigate = useNavigate()
  const { userId } = useParams<{ userId: string }>()
  const userIdNum = userId ? parseInt(userId) : 0
  const [addTaskModalOpen, setAddTaskModalOpen] = useState(false)

  const { data: users = [], isLoading: isEmployeeLoading } = useAdminUsers()
  const { data: templates = [] } = useTemplatePlans()
  const employee = useMemo(() => users.find((u) => u.id === userIdNum), [users, userIdNum])

  // Загружаем план только если это новый сотрудник
  const { data: plan, refetch: refetchPlan } = useMenteeOnboardingPlan(
    employee?.role === 'new_employee' ? userIdNum : -1
  )

  // Загружаем опросы пользователя
  const { data: userFeedbacks = [] } = useUserFeedback(userIdNum)

  const templateNameMap = useMemo(() => {
    const map = new Map()
    templates.forEach((template) => {
      map.set(template.id, template.title)
    })
    return map
  }, [templates])

  const updateUserMutation = useUpdateAdminUser()
  const updateTaskStatusMutation = useUpdateTaskStatus()
  const addTaskMutation = useAddTaskToMentee()

  const deleteTaskMutation = useDeleteTaskFromMentee()

  const tasks = useMemo(() => {
    if (!plan) return []

    return plan.stages.flatMap((stage) =>
      stage.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        stage: stage.title,
        done: task.is_completed,
        due: task.due_date ? formatDate(task.due_date) : '',
        dueDate: task.due_date,
        overdue: false,
        isSystemTask: task.is_system_task,
      }))
    ) as AdminTask[]
  }, [plan])

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

  if (!userId || !userIdNum) {
    navigate('/admin')
    return null
  }

  if (isEmployeeLoading || !employee) {
    return <Spin />
  }

  const planName = plan?.template_id ? templateNameMap.get(plan.template_id) : undefined

  const displayEmployee = {
    ...employee,
    name: employee.full_name,
    email: employee.email,
    position: employee.position || '',
    department: employee.department || '',
    mentor: employee.mentor?.full_name || 'Не назначен',
    mentor_id: employee.mentor_id,
    plan: planName || '—',
    plan_id: plan?.template_id,
    startDate: plan?.start_date ? formatDate(plan.start_date) : formatDate(employee.created_at),
    role: (employee.role === 'new_employee' ? 'employee' : employee.role) as
      | 'employee'
      | 'mentor'
      | 'admin',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/admin')}
        style={{ color: '#ff6720', padding: 0, alignSelf: 'flex-start' }}
      >
        Назад
      </Button>

      <Row gutter={24}>
        <Col span={8}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <EmployeeProfileCard
              name={displayEmployee.name}
              position={displayEmployee.position}
              department={displayEmployee.department}
              role={displayEmployee.role}
            />

            {displayEmployee.role === 'employee' && (
              <EmployeeProgressCard tasks={tasks} />
            )}

            <EmployeeDataCard
              userId={employee.id}
              data={displayEmployee}
              onSave={(values) => {
                if (!employee) return
                const updates: Partial<User> = {}
                if ('email' in values) updates.email = values.email as string
                if ('position' in values)
                  updates.position = values.position as string | null
                if ('department' in values)
                  updates.department = values.department as string | null
                if ('mentor' in values && values.mentor) {
                  updates.mentor_id = typeof values.mentor === 'number' ? values.mentor : undefined
                }

                updateUserMutation.mutate(
                  { userId: employee.id, payload: updates },
                  {
                    onSuccess: () => {
                      message.success('Данные обновлены')
                      refetchPlan()
                    },
                    onError: () => {
                      message.error('Ошибка при обновлении данных')
                    },
                  }
                )
              }}
            />
          </div>
        </Col>

        <Col span={16}>
          {displayEmployee.role === 'employee' ? (
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
                      <EmployeeTaskList
                        tasks={tasks}
                        onTasksChange={(updatedTasks) => {
                          updatedTasks.forEach((task) => {
                            const originalTask = tasks.find((t) => t.id === task.id)
                            if (originalTask && originalTask.done !== task.done) {
                              updateTaskStatusMutation.mutate(
                                {
                                  userId: employee.id,
                                  taskId: task.id,
                                  isCompleted: task.done,
                                },
                                {
                                  onSuccess: () => {
                                    refetchPlan()
                                  },
                                }
                              )
                            }
                          })
                        }}
                        onDeleteTask={(taskId) => {
                          deleteTaskMutation.mutate(
                            {
                              userId: employee.id,
                              taskId,
                            },
                            {
                              onSuccess: () => {
                                message.success('Задача удалена')
                                refetchPlan()
                              },
                              onError: () => {
                                message.error('Ошибка при удалении задачи')
                              },
                            }
                          )
                        }}
                      />
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
                    addTaskMutation.mutate(
                      {
                        userId: employee.id,
                        stageId: values.stageId,
                        payload: {
                          title: values.title,
                          description: values.description,
                          due_date: values.dueDate,
                        },
                      },
                      {
                        onSuccess: () => {
                          message.success('Задача добавлена')
                          setAddTaskModalOpen(false)
                          refetchPlan()
                        },
                        onError: () => {
                          message.error('Ошибка при добавлении задачи')
                        },
                      }
                    )
                  }}
                  stages={plan.stages}
                />
              )}
            </Card>
          ) : (
            <EmployeeEmptyPlan role={displayEmployee.role as 'mentor' | 'admin'} />
          )}
        </Col>
      </Row>
    </div>
  )
}

export default AdminEmployeePage
