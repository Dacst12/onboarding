import { Card, Tag, Typography } from 'antd'
import { SolutionOutlined } from '@ant-design/icons'
import { moodColor, moodLabel } from '../mentor/types'

const { Text } = Typography

interface Survey {
  week: number
  mood: number
  clarity: string
  comment?: string
  date: string
}

const clarityLabel: Record<string, string> = {
  yes: 'Да',
  no: 'Нет',
  partial: 'Частично',
}

const clarityColor: Record<string, string> = {
  yes: '#52c41a',
  no: '#ff4d4f',
  partial: '#faad14',
}

interface EmployeeSurveyListProps {
  surveys: Survey[]
}

const EmployeeSurveyList = ({ surveys }: EmployeeSurveyListProps) => {
  if (!surveys || surveys.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px', color: '#999' }}>
        <Text>Опросов ещё нет</Text>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {surveys.map((survey) => (
      <Card
        key={survey.week}
        style={{ borderRadius: 10 }}
        bodyStyle={{ padding: '16px 20px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: '#fff3ee',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <SolutionOutlined style={{ color: '#ff6720', fontSize: 18 }} />
            </div>
            <div>
              <Text strong style={{ fontSize: 17, display: 'block' }}>
                Неделя {survey.week}
              </Text>
              <Text style={{ fontSize: 12, color: '#bbb' }}>{survey.date}</Text>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Tag
              style={{
                background: `${moodColor[survey.mood]}15`,
                border: `1px solid ${moodColor[survey.mood]}30`,
                color: moodColor[survey.mood],
                borderRadius: 6,
                fontSize: 14,
              }}
            >
              {moodLabel[survey.mood]}
            </Tag>
            <Tag
              style={{
                background: `${clarityColor[survey.clarity]}15`,
                border: `1px solid ${clarityColor[survey.clarity]}30`,
                color: clarityColor[survey.clarity],
                borderRadius: 6,
                fontSize: 14,
              }}
            >
              Задачи: {clarityLabel[survey.clarity]}
            </Tag>
          </div>
        </div>
        {survey.comment && (
          <Text
            style={{
              fontSize: 15,
              color: '#666',
              display: 'block',
              marginTop: 12,
              paddingTop: 12,
              borderTop: '1px solid #f5f5f5',
            }}
          >
            {survey.comment}
          </Text>
        )}
      </Card>
    ))}
    </div>
  )
}

export default EmployeeSurveyList
