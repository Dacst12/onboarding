import { Card, Avatar, Typography, Progress, Tag } from 'antd'
import { CalendarOutlined, SolutionOutlined } from '@ant-design/icons'
import { getInitials, getDepartmentColor } from '../../utils/directory'
import type { Mentee } from './types'
import { moodColor, moodLabel } from './types'

const { Text } = Typography

interface MenteeCardProps {
  mentee: Mentee
  onClick: () => void
}

const MenteeCard = ({ mentee, onClick }: MenteeCardProps) => {
  const percent = Math.round((mentee.completedTasks / mentee.totalTasks) * 100)

  return (
    <Card
      style={{
        borderRadius: 12,
        cursor: 'pointer',
        transition: 'all 0.15s',
        height: '100%',
      }}
      bodyStyle={{ padding: '24px' }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.transform = 'translateY(-2px)')
      }
      onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
      onClick={onClick}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Шапка */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <Avatar
            size={56}
            style={{
              background: getDepartmentColor(mentee.department),
              fontSize: 20,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {getInitials(mentee.name)}
          </Avatar>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Text strong style={{ fontSize: 17, display: 'block' }}>
              {mentee.name}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: '#999',
                display: 'block',
                marginTop: 2,
              }}
            >
              {mentee.position}
            </Text>
          </div>
        </div>

        {/* Дата выхода */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CalendarOutlined style={{ color: '#bbb', fontSize: 15 }} />
          <Text style={{ fontSize: 15, color: '#999' }}>
            Вышел {mentee.startDate}
          </Text>
        </div>

        {/* Прогресс */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 6,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: 500, color: '#999' }}>
              Прогресс адаптации
            </Text>
            <Text style={{ fontSize: 15, fontWeight: 600, color: '#ff6720' }}>
              {mentee.completedTasks}/{mentee.totalTasks}
            </Text>
          </div>
          <Progress
            percent={percent}
            strokeColor="#ff6720"
            trailColor="#ffe8dc"
            showInfo={false}
          />
          <Text style={{ fontSize: 15, color: '#bbb' }}>
            {percent}% выполнено
          </Text>
        </div>

        {/* Опрос */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 8,
              background: mentee.lastSurvey.filled ? '#fff3ee' : '#fafafa',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <SolutionOutlined
              style={{
                color: mentee.lastSurvey.filled ? '#ff6720' : '#bbb',
                fontSize: 17,
              }}
            />
          </div>
          <div>
            <Text style={{ fontSize: 15, color: '#bbb', display: 'block' }}>
              Неделя {mentee.lastSurvey.week}
            </Text>
            {mentee.lastSurvey.filled && mentee.lastSurvey.mood ? (
              <Tag
                style={{
                  background: `${moodColor[mentee.lastSurvey.mood]}15`,
                  border: `1px solid ${moodColor[mentee.lastSurvey.mood]}30`,
                  color: moodColor[mentee.lastSurvey.mood],
                  borderRadius: 6,
                  fontSize: 15,
                  margin: 0,
                }}
              >
                {moodLabel[mentee.lastSurvey.mood]}
              </Tag>
            ) : (
              <Tag
                style={{
                  background: '#fafafa',
                  border: '1px solid #f0f0f0',
                  color: '#bbb',
                  borderRadius: 6,
                  fontSize: 15,
                  margin: 0,
                }}
              >
                Не заполнен
              </Tag>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default MenteeCard
