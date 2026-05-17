import { useMemo, useState } from 'react'
import { useQueries } from '@tanstack/react-query'
import { Typography, Button, message, Spin } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import EmployeeTable from '../../components/admin/EmployeeTable'
import AddEmployeeModal from '../../components/admin/AddEmployeeModal'
import { useAdminUsers, useCreateAdminUser, useTemplatePlans } from '../../api/hooks/useAdmin'
import { getMenteeOnboardingPlan, getLastFeedback } from '../../api/admin'
import useAuthStore from '../../store/authStore'
import { formatDate } from '../../utils/date'
import type { EmployeeTableRow } from '../../components/admin/EmployeeTable'
import type { User } from '../../types/user'
import type { CreateAdminUserPayload, PlanStageData, PlanTaskData } from '../../api/types/admin'

const { Title, Text } = Typography

const AdminDashboardPage = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const { data: users = [], isLoading: isUsersLoading } = useAdminUsers()
  const { data: templates = [], isLoading: isTemplatesLoading } = useTemplatePlans()
  const { user: currentUser } = useAuthStore()
  const createUserMutation = useCreateAdminUser()

  const newEmployeeUsers = useMemo(
    () => users.filter((user) => user.role === 'new_employee' && user.id !== currentUser?.id),
    [users, currentUser?.id]
  )

  const plansResults = useQueries({
    queries: newEmployeeUsers.map((user) => ({
      queryKey: ['admin', 'users', user.id, 'plan'],
      queryFn: () => getMenteeOnboardingPlan(user.id),
      staleTime: 5 * 60 * 1000,
    })),
  })

  const templatesByIdMap = useMemo(() => {
    const map = new Map()
    templates.forEach((template) => {
      map.set(template.id, template.title)
    })
    return map
  }, [templates])

  const plansByUserId = useMemo(() => {
    const map = new Map()
    newEmployeeUsers.forEach((user, index) => {
      if (plansResults[index]?.data) {
        map.set(user.id, plansResults[index].data)
      }
    })
    return map
  }, [newEmployeeUsers, plansResults])

  const feedbackResults = useQueries({
    queries: users.map((user) => ({
      queryKey: ['admin', 'users', user.id, 'feedback'],
      queryFn: () => getLastFeedback(user.id),
      staleTime: 5 * 60 * 1000,
    })),
  })

  const feedbackByUserId = useMemo(() => {
    const map = new Map()
    users.forEach((user, index) => {
      if (feedbackResults[index]?.data?.mood) {
        map.set(user.id, feedbackResults[index].data.mood)
      }
    })
    return map
  }, [users, feedbackResults])

  // Исключаем текущего админа из списка
  const enrichedEmployees = useMemo(() => {
    if (!users.length) return []

    return users
      .filter((user) => user.id !== currentUser?.id)
      .map((user) => {
        const plan = plansByUserId.get(user.id)
        const planName = plan?.template_id ? templatesByIdMap.get(plan.template_id) : undefined

        // Подсчитываем выполненные и общее количество задач
        let completedTasks = 0
        let totalTasks = 0
        if (plan?.stages) {
          plan.stages.forEach((stage: PlanStageData) => {
            stage.tasks?.forEach((task: PlanTaskData) => {
              totalTasks++
              if (task.is_completed) {
                completedTasks++
              }
            })
          })
        }

        return {
          ...user,
          plan: planName || '—',
          startDate:
            user.role === 'new_employee' && plan?.start_date
              ? formatDate(plan.start_date)
              : user.created_at
                ? formatDate(user.created_at)
                : undefined,
          mentor: user.mentor || undefined,
          completedTasks: user.role === 'new_employee' ? completedTasks : undefined,
          totalTasks: user.role === 'new_employee' ? totalTasks : undefined,
          lastMood: feedbackByUserId.get(user.id),
        }
      }) as EmployeeTableRow[]
  }, [users, currentUser?.id, plansByUserId, templatesByIdMap, feedbackByUserId])

  const handleAddEmployee = async (
    employee: User & {
      password?: string
      template_id?: number | null
      start_date?: string | null
    }
  ) => {
    try {
      if (!employee.password) {
        message.error('Пароль не установлен')
        return
      }

      const payload: CreateAdminUserPayload = {
        email: employee.email,
        full_name: employee.full_name,
        password: employee.password,
        role: employee.role as 'new_employee' | 'mentor' | 'admin',
        position: employee.position,
        department: employee.department,
        mentor_id: employee.mentor_id || undefined,
        template_id: employee.template_id || undefined,
        start_date: employee.start_date || undefined,
      }
      await createUserMutation.mutateAsync(payload)
      message.success('Сотрудник успешно добавлен')
      setModalOpen(false)
    } catch (error) {
      message.error('Ошибка при добавлении сотрудника')
      console.error(error)
    }
  }

  if (isUsersLoading || isTemplatesLoading) {
    return <Spin />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Title level={4} style={{ margin: '0 0 4px' }}>
            Сотрудники
          </Title>
          <Text style={{ color: '#999', fontSize: 15 }}>
            {enrichedEmployees.length} человек в системе
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ background: '#ff6720', border: 'none', borderRadius: 10 }}
          onClick={() => setModalOpen(true)}
        >
          Добавить сотрудника
        </Button>
      </div>

      <EmployeeTable employees={enrichedEmployees} />

      <AddEmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={handleAddEmployee}
      />
    </div>
  )
}

export default AdminDashboardPage