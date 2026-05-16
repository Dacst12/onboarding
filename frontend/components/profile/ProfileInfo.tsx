import { Card, Avatar, Tag, Typography, Divider } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { getDepartmentColor, getInitials } from '../../utils/directory'

const { Title, Text } = Typography

interface ProfileInfoProps {
  name: string
  email: string
  position: string
  department: string
  team: string
  startDate: string
  mentor: string
}

const ProfileInfo = ({
  name,
  email,
  position,
  department,
  team,
  startDate,
  mentor,
}: ProfileInfoProps) => (
  <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: '28px 32px' }}>
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Avatar
        size={80}
        icon={<UserOutlined />}
        style={{
          background: getDepartmentColor(department),
          fontSize: 32,
          fontWeight: 600,
          flexShrink: 0,
        }}
      >
        {getInitials(name)}
      </Avatar>

      <div style={{ flex: 1 }}>
        <Title level={4} style={{ margin: '0 0 4px' }}>
          {name}
        </Title>
        <Text style={{ fontSize: 15, color: '#999', display: 'block' }}>
          {position}
        </Text>
        <div
          style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}
        >
          <Tag
            style={{
              background: `${getDepartmentColor(department)}15`,
              border: `1px solid ${getDepartmentColor(department)}30`,
              color: getDepartmentColor(department),
              borderRadius: 6,
              fontSize: 13,
              padding: '2px 10px',
            }}
          >
            {department}
          </Tag>
          <Tag
            style={{
              background: '#fafafa',
              border: '1px solid #f0f0f0',
              color: '#999',
              borderRadius: 6,
              fontSize: 13,
              padding: '2px 10px',
            }}
          >
            {team}
          </Tag>
        </div>
      </div>
    </div>

    <Divider style={{ margin: '24px 0' }} />

    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
      }}
    >
      {[
        { label: 'Дата выхода', value: startDate },
        { label: 'Наставник', value: mentor },
        { label: 'Email', value: email },
      ].map((item) => (
        <div key={item.label}>
          <Text
            style={{
              fontSize: 12,
              color: '#bbb',
              display: 'block',
              marginBottom: 4,
            }}
          >
            {item.label}
          </Text>
          <Text style={{ fontSize: 15, fontWeight: 500 }}>{item.value}</Text>
        </div>
      ))}
    </div>
  </Card>
)

export default ProfileInfo
