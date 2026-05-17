import { Card, Typography } from 'antd'
import { TrophyOutlined } from '@ant-design/icons'

const { Text } = Typography

const AchievementList = () => (
  <Card
    title={
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <TrophyOutlined style={{ color: '#ff6720' }} />
        <span style={{ fontWeight: 600 }}>Достижения</span>
      </div>
    }
    style={{ borderRadius: 12 }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        textAlign: 'center',
      }}
    >
      <Text style={{ fontSize: 15, color: '#999' }}>
        Скоро здесь появятся ваши достижения
      </Text>
    </div>
  </Card>
)

export default AchievementList
