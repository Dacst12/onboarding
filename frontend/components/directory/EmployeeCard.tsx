import { Card, Avatar, Tag, Typography } from 'antd'
import { MailOutlined, PhoneOutlined, TeamOutlined } from '@ant-design/icons'
import type { CSSProperties } from 'react'
import type { Employee } from '../../types/user'
import {
  getInitials,
  getDepartmentColor,
  getTagStyle,
} from '../../utils/directory'

const { Text } = Typography

const cardLinkStyle: CSSProperties = {
  flex: 1,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  padding: '8px 0',
  borderRadius: 8,
  background: '#f9f9f9',
  color: '#666',
  fontSize: 14,
  cursor: 'pointer',
  border: '1px solid #f0f0f0',
  transition: 'all 0.15s',
  fontWeight: 500,
}

const handleHoverEnter = (e: React.MouseEvent<HTMLDivElement>) => {
  const el = e.currentTarget
  el.style.background = '#fff3ee'
  el.style.borderColor = '#ffd0b5'
  el.style.color = '#ff6720'
}

const handleHoverLeave = (e: React.MouseEvent<HTMLDivElement>) => {
  const el = e.currentTarget
  el.style.background = '#f9f9f9'
  el.style.borderColor = '#f0f0f0'
  el.style.color = '#666'
}

interface EmployeeCardProps {
  employee: Employee
  onClick: () => void
}

const EmployeeCard = ({ employee, onClick }: EmployeeCardProps) => (
  <Card
    style={{
      borderRadius: 12,
      cursor: 'pointer',
      transition: 'all 0.15s',
      height: '100%',
    }}
    bodyStyle={{ padding: '20px' }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
    onClick={onClick}
  >
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
        <Avatar
          size={52}
          src={employee.avatar}
          style={{
            background: getDepartmentColor(employee.department),
            fontSize: 18,
            fontWeight: 600,
            flexShrink: 0,
          }}
        >
          {!employee.avatar && getInitials(employee.name)}
        </Avatar>

        <div style={{ flex: 1, minWidth: 0 }}>
          <Text
            strong
            style={{ fontSize: 16, display: 'block', lineHeight: 1.3 }}
          >
            {employee.name}
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: '#999',
              display: 'block',
              marginTop: 2,
            }}
          >
            {employee.position}
          </Text>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: 6,
            flexShrink: 0,
          }}
        >
          <Tag style={getTagStyle(employee.department)}>
            {employee.department}
          </Tag>
          <Tag
            style={{
              background: '#fafafa',
              border: '1px solid #f0f0f0',
              color: '#999',
              borderRadius: 6,
              fontSize: 12,
              margin: 0,
            }}
          >
            <TeamOutlined style={{ marginRight: 3 }} />
            {employee.team}
          </Tag>
        </div>
      </div>

      <Text
        style={
          {
            fontSize: 13,
            color: '#bbb',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: 1.5,
          } as CSSProperties
        }
      >
        {employee.responsibilities}
      </Text>

      <div style={{ display: 'flex', gap: 8 }}>
        <div
          onClick={(e) => {
            e.stopPropagation()
            window.location.href = `mailto:${employee.email}`
          }}
          style={cardLinkStyle}
          onMouseEnter={handleHoverEnter}
          onMouseLeave={handleHoverLeave}
        >
          <MailOutlined />
          Email
        </div>
        {employee.phone && (
          <div
            onClick={(e) => {
              e.stopPropagation()
              window.location.href = `tel:${employee.phone}`
            }}
            style={cardLinkStyle}
            onMouseEnter={handleHoverEnter}
            onMouseLeave={handleHoverLeave}
          >
            <PhoneOutlined />
            Позвонить
          </div>
        )}
      </div>
    </div>
  </Card>
)

export default EmployeeCard
