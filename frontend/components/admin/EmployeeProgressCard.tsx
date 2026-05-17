import { Card, Progress, Typography } from 'antd'
import type { AdminTask } from './EmployeeTaskList'

const { Text } = Typography

interface EmployeeProgressCardProps {
  tasks: AdminTask[]
}

const EmployeeProgressCard = ({ tasks }: EmployeeProgressCardProps) => {
  const done = tasks.filter((t) => t.done).length
  const total = tasks.length
  const percent = Math.round((done / total) * 100)

  return (
    <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: '20px 24px' }}>
      <Text
        style={{
          fontSize: 15,
          color: '#bbb',
          display: 'block',
          marginBottom: 8,
        }}
      >
        Прогресс адаптации
      </Text>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: 6,
        }}
      >
        <Text style={{ fontSize: 16, color: '#999' }}>
          {done}/{total} задач
        </Text>
        <Text style={{ fontSize: 16, fontWeight: 600, color: '#ff6720' }}>
          {percent}%
        </Text>
      </div>
      <Progress
        percent={percent}
        strokeColor="#ff6720"
        trailColor="#ffe8dc"
        showInfo={false}
      />
    </Card>
  )
}

export default EmployeeProgressCard
