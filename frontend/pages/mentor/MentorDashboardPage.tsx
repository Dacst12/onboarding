import { Row, Col, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import MenteeCard from '../../components/mentor/MenteeCard'
import type { Mentee } from '../../components/mentor/types'

const { Title, Text } = Typography

const mockMentees: Mentee[] = [
  {
    id: 1,
    name: 'Иван Петров',
    position: 'Frontend Developer',
    department: 'Разработка',
    startDate: '5 мая 2025',
    completedTasks: 8,
    totalTasks: 12,
    lastSurvey: { week: 2, filled: true, mood: 4 },
  },
  {
    id: 2,
    name: 'Анна Сидорова',
    position: 'QA Engineer',
    department: 'Разработка',
    startDate: '12 мая 2025',
    completedTasks: 3,
    totalTasks: 12,
    lastSurvey: { week: 1, filled: false },
  },
  {
    id: 3,
    name: 'Дмитрий Ким',
    position: 'Backend Developer',
    department: 'Разработка',
    startDate: '1 апреля 2025',
    completedTasks: 11,
    totalTasks: 12,
    lastSurvey: { week: 4, filled: true, mood: 5 },
  },
]

const MentorDashboardPage = () => {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Title level={4} style={{ margin: '0 0 4px' }}>
          Мои подопечные
        </Title>
        <Text style={{ color: '#999', fontSize: 16 }}>
          {mockMentees.length} сотрудника на адаптации
        </Text>
      </div>

      <Row gutter={[16, 16]}>
        {mockMentees.map((mentee) => (
          <Col key={mentee.id} span={8}>
            <MenteeCard
              mentee={mentee}
              onClick={() => navigate(`/mentor/${mentee.id}`)}
            />
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default MentorDashboardPage
