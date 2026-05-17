import { Card, Avatar, Tag, Typography } from 'antd'
import { getInitials, getDepartmentColor } from '../../utils/directory'

const { Title, Text } = Typography

const roleLabel: Record<string, string> = {
  employee: 'Сотрудник',
  mentor: 'Наставник',
  admin: 'Администратор',
}

interface EmployeeProfileCardProps {
  name: string
  position: string
  department: string
  role: 'employee' | 'mentor' | 'admin'
}

const EmployeeProfileCard = ({
  name,
  position,
  department,
  role,
}: EmployeeProfileCardProps) => (
  <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: '24px' }}>
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        textAlign: 'center',
      }}
    >
      <Avatar
        size={72}
        style={{
          background: getDepartmentColor(department),
          fontSize: 28,
          fontWeight: 600,
        }}
      >
        {getInitials(name)}
      </Avatar>
      <div>
        <Title level={5} style={{ margin: '0 0 4px' }}>
          {name}
        </Title>
        <Text style={{ fontSize: 14, color: '#999', display: 'block' }}>
          {position}
        </Text>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 6,
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        <Tag
          style={{
            background: `${getDepartmentColor(department)}15`,
            border: `1px solid ${getDepartmentColor(department)}30`,
            color: getDepartmentColor(department),
            borderRadius: 6,
            fontSize: 14,
          }}
        >
          {department}
        </Tag>
        <Tag
          style={{
            background: '#f0f0f0',
            border: '1px solid #e0e0e0',
            color: '#666',
            borderRadius: 6,
            fontSize: 14,
          }}
        >
          {roleLabel[role]}
        </Tag>
      </div>
    </div>
  </Card>
)

export default EmployeeProfileCard
