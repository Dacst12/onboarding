import { Card, Avatar, Typography, Progress, Tag } from 'antd'
import { getDepartmentColor, getInitials } from '../../utils/directory'
import { moodColor, moodLabel } from './types'

const { Title, Text } = Typography

interface MenteeHeaderProps {
  name: string
  position: string
  department: string
  startDate: string
  completedTasks: number
  totalTasks: number
  lastSurvey: {
    week: number
    filled: boolean
    mood?: number
  }
}

const MenteeHeader = ({
  name,
  position,
  department,
  startDate,
  completedTasks,
  totalTasks,
  lastSurvey,
}: MenteeHeaderProps) => {
  const percent = Math.round((completedTasks / totalTasks) * 100)

  return (
    <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: '20px 24px' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          justifyContent: 'space-between',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Avatar
            size={52}
            style={{
              background: getDepartmentColor(department),
              fontSize: 18,
              fontWeight: 600,
            }}
          >
            {getInitials(name)}
          </Avatar>
          <div>
            <Title level={5} style={{ margin: 0 }}>
              {name}
            </Title>
            <Text style={{ color: '#999', fontSize: 14 }}>
              {position} · Вышел {startDate}
            </Text>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ textAlign: 'right' }}>
            <Text style={{ fontSize: 12, color: '#bbb', display: 'block' }}>
              Прогресс
            </Text>
            <Text style={{ fontSize: 15, fontWeight: 600, color: '#ff6720' }}>
              {completedTasks}/{totalTasks} задач
            </Text>
          </div>
          <div style={{ width: 120 }}>
            <Progress
              percent={percent}
              strokeColor="#ff6720"
              trailColor="#ffe8dc"
              showInfo={false}
              size="small"
            />
          </div>
          {lastSurvey.filled && lastSurvey.mood && (
            <Tag
              style={{
                background: `${moodColor[lastSurvey.mood]}15`,
                border: `1px solid ${moodColor[lastSurvey.mood]}30`,
                color: moodColor[lastSurvey.mood],
                borderRadius: 6,
                fontSize: 13,
                padding: '2px 10px',
              }}
            >
              {moodLabel[lastSurvey.mood]}
            </Tag>
          )}
        </div>
      </div>
    </Card>
  )
}

export default MenteeHeader
