import { Card, Typography, Tabs } from 'antd'
import ProgressTab from '../../components/admin/surveys/ProgressTab'
import SurveysTab from '../../components/admin/surveys/SurveysTab'
import SurveySettingsTab from '../../components/admin/surveys/SurveySettingsTab'
import type {
  ProgressData,
  MoodPoint,
} from '../../components/admin/surveys/types'

const { Title, Text } = Typography

const mockProgressData: ProgressData[] = [
  { department: 'Разработка', total: 5, onboarding: 3, avgPercent: 62 },
  { department: 'Дизайн', total: 2, onboarding: 1, avgPercent: 45 },
  { department: 'Продукт', total: 1, onboarding: 0, avgPercent: 100 },
  { department: 'Инфраструктура', total: 1, onboarding: 1, avgPercent: 20 },
  { department: 'HR', total: 1, onboarding: 0, avgPercent: 100 },
]

const mockMoodData: Record<string, MoodPoint[]> = {
  all: [
    { week: 1, avgMood: 3.2 },
    { week: 2, avgMood: 3.8 },
    { week: 3, avgMood: 4.1 },
    { week: 4, avgMood: 3.9 },
    { week: 5, avgMood: 4.3 },
  ],
  Разработка: [
    { week: 1, avgMood: 3.0 },
    { week: 2, avgMood: 3.5 },
    { week: 3, avgMood: 4.0 },
    { week: 4, avgMood: 3.7 },
    { week: 5, avgMood: 4.2 },
  ],
  Дизайн: [
    { week: 1, avgMood: 3.5 },
    { week: 2, avgMood: 4.0 },
    { week: 3, avgMood: 4.2 },
    { week: 4, avgMood: 4.1 },
    { week: 5, avgMood: 4.5 },
  ],
}

const tabs = [
  {
    key: 'progress',
    label: <span style={{ fontSize: 17 }}>Прогресс</span>,
    children: <ProgressTab data={mockProgressData} />,
  },
  {
    key: 'surveys',
    label: <span style={{ fontSize: 17 }}>Опросы</span>,
    children: <SurveysTab moodData={mockMoodData} />,
  },
  {
    key: 'settings',
    label: <span style={{ fontSize: 17 }}>Настройки</span>,
    children: <SurveySettingsTab />,
  },
]

const AdminSurveysPage = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
    <div>
      <Title level={4} style={{ margin: '0 0 4px' }}>
        Аналитика
      </Title>
      <Text style={{ color: '#999', fontSize: 17 }}>
        Прогресс адаптации и настроение сотрудников
      </Text>
    </div>
    <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: '0 24px 24px' }}>
      <Tabs items={tabs} />
    </Card>
  </div>
)

export default AdminSurveysPage
