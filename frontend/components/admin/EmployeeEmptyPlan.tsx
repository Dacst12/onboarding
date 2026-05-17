import { Card, Typography } from 'antd'
import { UserOutlined } from '@ant-design/icons'

const { Text } = Typography

interface EmployeeEmptyPlanProps {
  role: 'mentor' | 'admin'
}

const EmployeeEmptyPlan = ({ role }: EmployeeEmptyPlanProps) => (
  <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: '28px 32px' }}>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: '40px 0',
        textAlign: 'center',
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: '#f9f9f9',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <UserOutlined style={{ fontSize: 30, color: '#bbb' }} />
      </div>
      <Text strong style={{ fontSize: 18, color: '#1a1a1a' }}>
        План адаптации не назначен
      </Text>
      <Text style={{ fontSize: 16, color: '#bbb', maxWidth: 320 }}>
        Этот сотрудник является{' '}
        {role === 'mentor' ? 'наставником' : 'администратором'} — план адаптации
        для него не предусмотрен
      </Text>
    </div>
  </Card>
)

export default EmployeeEmptyPlan
