import { useState } from 'react'
import { Card, Form, Input, Button, Typography, message } from 'antd'
import {
  PhoneOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  SendOutlined,
} from '@ant-design/icons'
import useAuthStore from '../../store/authStore'
import api from '../../api/axios'

const { Text } = Typography

interface ContactForm {
  phone?: string
  telegram?: string
}

interface ProfileContactsProps {
  initial: ContactForm
}

const ProfileContacts = ({ initial }: ProfileContactsProps) => {
  const { setAuth, token } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [contacts, setContacts] = useState<ContactForm>(initial)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()

  const handleSave = async () => {
    const values = form.getFieldsValue()
    setLoading(true)
    try {
      const response = await api.patch('/me', values)

      if (token) {
        setAuth(response.data, token)
      }
      setContacts(values)
      setEditing(false)
      message.success('Контактные данные сохранены')
    } catch {
      message.error('Ошибка при сохранении контактных данных')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    form.setFieldsValue(contacts)
    setEditing(false)
  }

  const contactItems: Array<{ icon: React.ReactNode; label: string; value: string | undefined }> = [
    { icon: <PhoneOutlined />, label: 'Телефон', value: contacts.phone },
    { icon: <SendOutlined />, label: 'Telegram', value: contacts.telegram },
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
                disabled={loading}
              >
                Отмена
              </Button>
              <Button
                icon={<SaveOutlined />}
                type="text"
                style={{ color: '#ff6720' }}
                onClick={handleSave}
                loading={loading}
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
            style={{ marginBottom: 0 }}
          >
            <Input
              prefix={<span style={{ color: '#ff6720' }}>@</span>}
              placeholder="username"
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
