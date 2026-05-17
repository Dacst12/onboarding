import { useMemo, useState } from 'react'
import { Typography, Modal, Form, Input } from 'antd'
import useAuthStore from '../../store/authStore'
import ProfileInfo from '../../components/profile/ProfileInfo'
import ProfileContacts from '../../components/profile/ProfileContacts'
import { formatDate } from '../../utils/date'
import api from '../../api/axios'

const { Title } = Typography

const ProfilePage = () => {
  const { user, setAuth, token } = useAuthStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const startDate = useMemo(() => {
    if (!user?.created_at) return ''
    return formatDate(user.created_at)
  }, [user])

  const isAdmin = user?.role === 'admin'

  const handleOpenModal = () => {
    form.setFieldsValue({
      full_name: user?.full_name || '',
      position: user?.position || '',
      department: user?.department || '',
    })
    setIsModalOpen(true)
  }

  const handleSaveModal = async () => {
    const values = await form.validateFields()
    setLoading(true)
    try {
      const response = await api.patch('/me', values)
      if (token) {
        setAuth(response.data, token)
      }
      setIsModalOpen(false)
    } catch {
      // Error handled by axios interceptor
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div
      style={{
        maxWidth: 680,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        Профиль
      </Title>

      <ProfileInfo
        name={user.full_name}
        email={user.email}
        position={user.position || 'Не указано'}
        department={user.department || 'Не указано'}
        startDate={startDate}
        mentor={user.mentor?.full_name || 'Не назначен'}
        isEditable={isAdmin}
        onEdit={handleOpenModal}
      />

      <ProfileContacts
        initial={{
          phone: user.phone || '',
          telegram: user.telegram || '',
        }}
      />

      <Modal
        title="Редактировать профиль"
        open={isModalOpen}
        onOk={handleSaveModal}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={loading}
        okText="Сохранить"
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="full_name"
            label="Имя"
            rules={[{ required: false }]}
          >
            <Input placeholder="Ваше имя" size="large" />
          </Form.Item>
          <Form.Item
            name="position"
            label="Должность"
            rules={[{ required: false }]}
          >
            <Input placeholder="Например: Senior Developer" size="large" />
          </Form.Item>
          <Form.Item
            name="department"
            label="Отдел"
            rules={[{ required: false }]}
          >
            <Input placeholder="Например: Разработка" size="large" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default ProfilePage
