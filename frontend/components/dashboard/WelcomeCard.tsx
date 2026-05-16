import { Card, Progress, Typography } from 'antd'

const { Title, Text } = Typography

interface WelcomeCardProps {
  name: string
  daysPassed: number
  totalDays: number
}

const WelcomeCard = ({ name, daysPassed, totalDays }: WelcomeCardProps) => {
  const percent = Math.round((daysPassed / totalDays) * 100)

  return (
    <Card
      style={{ borderRadius: 12, background: '#ff6720', height: '100%' }}
      bodyStyle={{ padding: '20px 24px' }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <Title level={4} style={{ margin: '0 0 4px', color: '#fff' }}>
            Привет, {name}!
          </Title>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 15 }}>
            Ты на {daysPassed}-м дне адаптации
          </Text>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#fff' }}>
            {percent}%
          </div>
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13 }}>
            адаптации
          </Text>
        </div>
      </div>
      <Progress
        percent={percent}
        strokeColor="rgba(255,255,255,0.9)"
        trailColor="rgba(255,255,255,0.25)"
        showInfo={false}
        style={{ marginTop: 12, marginBottom: 0 }}
      />
    </Card>
  )
}

export default WelcomeCard
