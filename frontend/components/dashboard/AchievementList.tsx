import { Card, Badge, Typography } from 'antd'
import { TrophyOutlined, LockOutlined } from '@ant-design/icons'

const { Text } = Typography

export interface Achievement {
  id: number
  title: string
  description: string
  unlocked: boolean
}

interface AchievementListProps {
  achievements: Achievement[]
}

const AchievementList = ({ achievements }: AchievementListProps) => (
  <Card
    title={
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <TrophyOutlined style={{ color: '#ff6720' }} />
        <span style={{ fontWeight: 600 }}>Достижения</span>
        <Badge
          count={`${achievements.filter((a) => a.unlocked).length}/${achievements.length}`}
          style={{ background: '#ff6720' }}
        />
      </div>
    }
    style={{ borderRadius: 12 }}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {achievements.map((a) => (
        <div
          key={a.id}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            padding: '10px 12px',
            borderRadius: 10,
            background: a.unlocked ? '#fff3ee' : '#fafafa',
            opacity: a.unlocked ? 1 : 0.5,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 8,
              background: a.unlocked ? '#ff6720' : '#e0e0e0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            {a.unlocked ? (
              <TrophyOutlined style={{ color: '#fff', fontSize: 15 }} />
            ) : (
              <LockOutlined style={{ color: '#fff', fontSize: 13 }} />
            )}
          </div>
          <div style={{ minWidth: 0 }}>
            <Text
              style={{
                fontWeight: 500,
                fontSize: 15,
                color: a.unlocked ? '#1a1a1a' : '#bbb',
                display: 'block',
              }}
            >
              {a.title}
            </Text>
            <Text style={{ fontSize: 13, color: '#bbb' }}>{a.description}</Text>
          </div>
        </div>
      ))}
    </div>
  </Card>
)

export default AchievementList
