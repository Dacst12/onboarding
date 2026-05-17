import { Card, Progress, Typography } from 'antd'

const { Text } = Typography

interface StatCardProps {
  icon: React.ReactNode
  label: string
  value: string
  sub: string
  percent: number
}

const StatCard = ({ icon, label, value, sub, percent }: StatCardProps) => (
  <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: '20px 24px' }}>
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 44,
            height: 44,
            background: '#fff3ee',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <div>
          <Text style={{ color: '#999', fontSize: 14 }}>{label}</Text>
          <div style={{ fontWeight: 600, fontSize: 15, color: '#1a1a1a' }}>
            {value}
          </div>
        </div>
      </div>
      <Text style={{ fontSize: 14, color: '#bbb', flexShrink: 0 }}>{sub}</Text>
    </div>
    <Progress
      percent={percent}
      strokeColor="#ff6720"
      trailColor="#ffe8dc"
      showInfo={false}
      style={{ marginTop: 12, marginBottom: 0 }}
    />
  </Card>
)

export default StatCard
