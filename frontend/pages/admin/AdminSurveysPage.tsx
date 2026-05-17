import { useMemo } from 'react'
import { Card, Typography, Tabs, Spin } from 'antd'
import ProgressTab from '../../components/admin/surveys/ProgressTab'
import SurveysTab from '../../components/admin/surveys/SurveysTab'
import SurveySettingsTab from '../../components/admin/surveys/SurveySettingsTab'
import { useProgressAnalytics, useMoodAnalytics } from '../../api/hooks/useAdmin'
import type {
  ProgressData,
  MoodPoint,
} from '../../components/admin/surveys/types'

const { Title, Text } = Typography

const AdminSurveysPage = () => {
  const { data: progressRaw = [], isLoading: isProgressLoading } =
    useProgressAnalytics()
  const { data: moodRaw = {}, isLoading: isMoodLoading } = useMoodAnalytics()

  const progressData = useMemo(() => {
    return progressRaw.map((item) => ({
      department: item.department,
      total: item.total,
      onboarding: item.onboarding,
      avgPercent: item.avg_percent,
    })) as ProgressData[]
  }, [progressRaw])

  const moodData = useMemo(() => {
    const result: Record<string, MoodPoint[]> = {}
    for (const [key, values] of Object.entries(moodRaw)) {
      result[key] = values.map((item) => ({
        week: item.week,
        avgMood: item.avg_mood,
      }))
    }
    return result
  }, [moodRaw])

  const tabs = [
    {
      key: 'progress',
      label: <span style={{ fontSize: 17 }}>Прогресс</span>,
      children: <ProgressTab data={progressData} />,
    },
    {
      key: 'surveys',
      label: <span style={{ fontSize: 17 }}>Опросы</span>,
      children: <SurveysTab moodData={moodData} />,
    },
    {
      key: 'settings',
      label: <span style={{ fontSize: 17 }}>Настройки</span>,
      children: <SurveySettingsTab />,
    },
  ]

  if (isProgressLoading || isMoodLoading) {
    return <Spin />
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div>
        <Title level={4} style={{ margin: '0 0 4px' }}>
          Аналитика
        </Title>
        <Text style={{ color: '#999', fontSize: 17 }}>
          Прогресс адаптации и настроение сотрудников
        </Text>
      </div>
      <Card style={{ borderRadius: 12 }}>
        <Tabs items={tabs} />
      </Card>
    </div>
  )
}

export default AdminSurveysPage
