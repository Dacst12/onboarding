import { Row, Col, Typography, Spin } from 'antd'
import { useNavigate } from 'react-router-dom'
import MenteeCard from '../../components/mentor/MenteeCard'
import { useMentees, useMenteeOnboardingPlan } from '../../api/hooks/useMentor'
import { formatDate } from '../../utils/date'
import type { Mentee } from '../../components/mentor/types'
import type { MenteeSummary } from '../../api/mentor'

const { Title, Text } = Typography

interface MenteeCardContainerProps {
  summary: MenteeSummary
  onClick: () => void
}

const MenteeCardContainer = ({ summary, onClick }: MenteeCardContainerProps) => {
  const { data: plan } = useMenteeOnboardingPlan(summary.id)

  const completedTasks = plan
    ? plan.stages.reduce((sum, stage) => sum + stage.tasks.filter(t => t.is_completed).length, 0)
    : 0
  const totalTasks = plan
    ? plan.stages.reduce((sum, stage) => sum + stage.tasks.length, 0)
    : 0

  const daysPassed = plan
    ? Math.max(
        0,
        Math.floor(
          (new Date().getTime() - new Date(plan.start_date).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      )
    : 0
  const week = Math.max(1, Math.floor(daysPassed / 7) + 1)

  const mentee: Mentee = {
    id: summary.id,
    email: '',
    full_name: summary.full_name,
    role: 'new_employee' as const,
    position: summary.position || '',
    department: '',
    is_active: true,
    created_at: summary.start_date || new Date().toISOString(),
    startDate: summary.start_date ? formatDate(summary.start_date) : '—',
    completedTasks,
    totalTasks,
    lastSurvey: { week, filled: summary.last_feedback_available, mood: undefined },
  }

  return <MenteeCard mentee={mentee} onClick={onClick} />
}

const MentorDashboardPage = () => {
  const navigate = useNavigate()
  const { data: menteesSummary = [], isLoading } = useMentees()

  if (isLoading) {
    return <Spin />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Title level={4} style={{ margin: '0 0 4px' }}>
          Мои подопечные
        </Title>
        <Text style={{ color: '#999', fontSize: 16 }}>
          {menteesSummary.length} сотрудника на адаптации
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {menteesSummary.map((summary) => (
          <Col key={summary.id} span={8}>
            <MenteeCardContainer
              summary={summary}
              onClick={() => navigate(`/mentor/${summary.id}`)}
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default MentorDashboardPage
