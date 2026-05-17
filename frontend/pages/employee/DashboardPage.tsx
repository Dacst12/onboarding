import { Row, Col, Spin } from 'antd'
import { useMemo } from 'react'
import {
  CheckCircleOutlined,
  CalendarOutlined,
  FlagOutlined,
} from '@ant-design/icons'
import { formatDate } from '../../utils/date'
import useAuthStore from '../../store/authStore'
import WelcomeCard from '../../components/dashboard/WelcomeCard'
import SurveyCard from '../../components/dashboard/SurveyCard'
import StatCard from '../../components/dashboard/StatCard'
import TaskList from '../../components/dashboard/TaskList'
import AchievementList from '../../components/dashboard/AchievementList'
import { useMyPlan, useLastFeedback } from '../../api/hooks/useEmployee'
import type { Task } from '../../components/dashboard/TaskList'

const DashboardPage = () => {
  const { user } = useAuthStore()
  const { data: plan, isLoading: isPlanLoading } = useMyPlan()
  const { data: lastFeedback } = useLastFeedback()

  const tasks = useMemo(() => {
    if (!plan) return []

    return plan.stages.flatMap((stage) =>
      stage.tasks.map((task) => ({
        id: task.id,
        title: task.title,
        description: task.description || '',
        due: task.due_date ? formatDate(task.due_date) : '',
        done: task.is_completed,
        priority: 'medium' as const,
      }))
    ) as Task[]
  }, [plan])

  const stats = useMemo(() => {
    if (!plan) {
      return {
        totalTasks: 0,
        completedTasks: 0,
        currentStage: '',
        stageNumber: 0,
        totalStages: 0,
        daysPassed: 0,
        totalDays: 90,
        adaptationPercent: 0,
        weekNumber: 1,
      }
    }

    const totalTasks = plan.stages.reduce(
      (acc, stage) => acc + stage.tasks.length,
      0
    )
    const completedTasks = plan.stages.reduce(
      (acc, stage) => acc + stage.tasks.filter((t) => t.is_completed).length,
      0
    )

    const today = new Date()
    const startDate = new Date(plan.start_date)
    const daysPassed = Math.floor(
      (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    )
    const totalDays = 90
    const adaptationPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
    const weekNumber = Math.max(1, Math.floor(Math.max(0, daysPassed) / 7) + 1)

    return {
      totalTasks,
      completedTasks,
      currentStage: plan.stages.length > 0 ? plan.stages[0].title : '',
      stageNumber: 1,
      totalStages: plan.stages.length,
      daysPassed: Math.max(0, daysPassed),
      totalDays,
      adaptationPercent,
      weekNumber,
    }
  }, [plan])

  if (isPlanLoading) {
    return <Spin />
  }

  const taskPercent =
    stats.totalTasks > 0
      ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
      : 0
  const daysLeft = stats.totalDays - stats.daysPassed
  const isSurveyFilledThisWeek =
    lastFeedback?.mood !== null &&
    lastFeedback?.mood !== undefined &&
    lastFeedback?.week_number === stats.weekNumber

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row gutter={16}>
        <Col span={12}>
          <WelcomeCard
            name={user?.full_name ?? 'Сотрудник'}
            daysPassed={stats.daysPassed}
            adaptationPercent={stats.adaptationPercent}
          />
        </Col>
        <Col span={12}>
          <SurveyCard
            filled={isSurveyFilledThisWeek}
            weekNumber={stats.weekNumber}
            filledAt={isSurveyFilledThisWeek ? 'Заполнен' : 'Не заполнен'}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <StatCard
            icon={<FlagOutlined style={{ color: '#ff6720', fontSize: 20 }} />}
            label="Текущий этап адаптации"
            value={stats.currentStage}
            sub={`Этап ${stats.stageNumber} из ${stats.totalStages}`}
            percent={stats.adaptationPercent}
          />
        </Col>
        <Col span={8}>
          <StatCard
            icon={
              <CheckCircleOutlined style={{ color: '#ff6720', fontSize: 20 }} />
            }
            label="Задачи"
            value={`${stats.completedTasks} / ${stats.totalTasks}`}
            sub={`${taskPercent}% выполнено`}
            percent={taskPercent}
          />
        </Col>
        <Col span={8}>
          <StatCard
            icon={
              <CalendarOutlined style={{ color: '#ff6720', fontSize: 20 }} />
            }
            label="Период адаптации"
            value={`${stats.daysPassed} из ${stats.totalDays} дней`}
            sub={
              daysLeft > 0
                ? `До конца адаптации ${daysLeft} дней`
                : 'Адаптация завершена'
            }
            percent={Math.round((stats.daysPassed / stats.totalDays) * 100)}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <TaskList tasks={tasks} />
        </Col>
        <Col span={8}>
          <AchievementList />
        </Col>
      </Row>
    </div>
  )
}

export default DashboardPage
