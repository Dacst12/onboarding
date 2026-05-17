import { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import type { Plan } from './types'

interface EditPlanModalProps {
  plan: Plan | null
  onClose: () => void
  onSave: (values: { name: string; roleType: string }) => void
}

const EditPlanModal = ({ plan, onClose, onSave }: EditPlanModalProps) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (plan) form.setFieldsValue(plan)
  }, [plan, form])

  const handleOk = () => {
    const values = form.getFieldsValue()
    onSave(values)
    onClose()
  }

  return (
    <Modal
      open={!!plan}
      onCancel={onClose}
      onOk={handleOk}
      okText="Сохранить"
      cancelText="Отмена"
      okButtonProps={{ style: { background: '#ff6720', border: 'none' } }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <EditOutlined style={{ color: '#ff6720' }} />
          <span>Редактировать шаблон</span>
        </div>
      }
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Название"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input size="large" style={{ borderRadius: 8 }} />
        </Form.Item>
        <Form.Item
          name="roleType"
          label="Роль / должность"
          style={{ marginBottom: 0 }}
        >
          <Input size="large" style={{ borderRadius: 8 }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditPlanModal
