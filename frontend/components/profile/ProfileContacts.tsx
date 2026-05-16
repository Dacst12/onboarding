import { useState } from 'react'
import { Card, Form, Input, Button, Typography, message } from 'antd'
import {
  PhoneOutlined,
  MailOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  SendOutlined,
} from '@ant-design/icons'

const { Text } = Typography

interface ContactForm {
  phone?: string
  telegram?: string
  vk?: string
}

interface ProfileContactsProps {
  initial: ContactForm
}

const ProfileContacts = ({ initial }: ProfileContactsProps) => {
  const [editing, setEditing] = useState(false)
  const [contacts, setContacts] = useState<ContactForm>(initial)
  const [form] = Form.useForm()

  const handleSave = () => {
    const values = form.getFieldsValue()
    setContacts(values)
    setEditing(false)
    message.success('Контактные данные сохранены')
  }

  const handleCancel = () => {
    form.setFieldsValue(contacts)
    setEditing(false)
  }

  const contactItems = [
    { icon: <PhoneOutlined />, label: 'Телефон', value: contacts.phone },
    { icon: <SendOutlined />, label: 'Telegram', value: contacts.telegram },
    {
      icon: <span style={{ fontSize: 14, fontWeight: 700 }}>VK</span>,
      label: 'ВКонтакте',
      value: contacts.vk,
    },
  ]

  return (
    <Card
      style={{ borderRadius: 12 }}
      bodyStyle={{ padding: '28px 32px' }}
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            Контактные данные
          </Text>
          {!editing ? (
            <Button
              icon={<EditOutlined />}
              type="text"
              style={{ color: '#ff6720' }}
              onClick={() => {
                form.setFieldsValue(contacts)
                setEditing(true)
              }}
            >
              Изменить
            </Button>
          ) : (
            <div style={{ display: 'flex', gap: 8 }}>
              <Button
                icon={<CloseOutlined />}
                type="text"
                style={{ color: '#bbb' }}
                onClick={handleCancel}
              >
                Отмена
              </Button>
              <Button
                icon={<SaveOutlined />}
                type="text"
                style={{ color: '#ff6720' }}
                onClick={handleSave}
              >
                Сохранить
              </Button>
            </div>
          )}
        </div>
      }
    >
      {!editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {contactItems.map((item) => (
            <div
              key={item.label}
              style={{ display: 'flex', alignItems: 'center', gap: 12 }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: '#fff3ee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ff6720',
                  flexShrink: 0,
                  fontSize: 15,
                }}
              >
                {item.icon}
              </div>
              <div>
                <Text style={{ fontSize: 12, color: '#bbb', display: 'block' }}>
                  {item.label}
                </Text>
                <Text
                  style={{
                    fontSize: 15,
                    color: item.value ? '#1a1a1a' : '#ddd',
                  }}
                >
                  {item.value || 'Не указано'}
                </Text>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <Form form={form} layout="vertical" requiredMark={false}>
          <Form.Item
            name="phone"
            label={<Text style={{ fontSize: 14 }}>Телефон</Text>}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: '#ff6720' }} />}
              placeholder="+7 999 000 00 00"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>
          <Form.Item
            name="telegram"
            label={<Text style={{ fontSize: 14 }}>Telegram</Text>}
          >
            <Input
              prefix={<span style={{ color: '#ff6720' }}>@</span>}
              placeholder="username"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>
          <Form.Item
            name="vk"
            label={<Text style={{ fontSize: 14 }}>ВКонтакте</Text>}
            style={{ marginBottom: 0 }}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#ff6720' }} />}
              placeholder="vk.com/username"
              size="large"
              style={{ borderRadius: 10 }}
            />
          </Form.Item>
        </Form>
      )}
    </Card>
  )
}

export default ProfileContacts
