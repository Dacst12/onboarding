import { Modal, Avatar, Tag, Typography } from 'antd'
import {
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  SendOutlined,
} from '@ant-design/icons'
import type { CSSProperties } from 'react'
import type { Employee } from '../../types/user'
import {
  getInitials,
  getDepartmentColor,
  getTagStyle,
} from '../../utils/directory'

const { Text } = Typography

const modalLinkStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  color: '#ff6720',
  fontSize: 15,
  cursor: 'pointer',
}

interface EmployeeModalProps {
  employee: Employee | null
  onClose: () => void
}

const EmployeeModal = ({ employee, onClose }: EmployeeModalProps) => (
  <Modal
    open={!!employee}
    onCancel={onClose}
    footer={null}
    title={
      employee && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar
            size={44}
            src={employee.avatar}
            style={{
              background: getDepartmentColor(employee.department),
              fontSize: 17,
              fontWeight: 600,
            }}
          >
            {!employee.avatar && getInitials(employee.name)}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 17, display: 'block' }}>
              {employee.name}
            </Text>
            <Text style={{ fontSize: 14, color: '#999' }}>
              {employee.position}
            </Text>
          </div>
        </div>
      )
    }
  >
    {employee && (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          paddingTop: 8,
        }}
      >
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Tag
            style={{
              ...getTagStyle(employee.department),
              fontSize: 14,
              padding: '3px 12px',
            }}
          >
            {employee.department}
          </Tag>
          <Tag
            style={{
              background: '#fafafa',
              border: '1px solid #f0f0f0',
              color: '#666',
              borderRadius: 6,
              fontSize: 14,
              padding: '3px 12px',
            }}
          >
            <TeamOutlined style={{ marginRight: 4 }} />
            {employee.team}
          </Tag>
        </div>

        <div>
          <Text
            style={{
              fontSize: 13,
              color: '#bbb',
              display: 'block',
              marginBottom: 4,
            }}
          >
            Зона ответственности
          </Text>
          <Text style={{ fontSize: 15, color: '#555' }}>
            {employee.responsibilities}
          </Text>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <Text style={{ fontSize: 13, color: '#bbb' }}>Контакты</Text>

          <div
            onClick={() => {
              window.location.href = `mailto:${employee.email}`
            }}
            style={modalLinkStyle}
          >
            <MailOutlined />
            {employee.email}
          </div>

          {employee.phone && (
            <div
              onClick={() => {
                window.location.href = `tel:${employee.phone}`
              }}
              style={modalLinkStyle}
            >
              <PhoneOutlined />
              {employee.phone}
            </div>
          )}

          {employee.telegram && (
            <div
              onClick={() => {
                window.open(
                  `https://t.me/${employee.telegram!.replace('@', '')}`,
                  '_blank'
                )
              }}
              style={modalLinkStyle}
            >
              <SendOutlined />
              {employee.telegram}
            </div>
          )}

          {employee.vk && (
            <div
              onClick={() => {
                window.open(`https://${employee.vk}`, '_blank')
              }}
              style={modalLinkStyle}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: '#ff6720' }}>
                VK
              </span>
              {employee.vk}
            </div>
          )}
        </div>
      </div>
    )}
  </Modal>
)

export default EmployeeModal
