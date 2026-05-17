import { useEffect } from 'react'
import { Modal, Form, Input } from 'antd'
import { EditOutlined } from '@ant-design/icons'
import type { PlanStage } from './types'

interface EditStageModalProps {
  stage: PlanStage | null
  onClose: () => void
  onSave: (title: string) => void
}

const EditStageModal = ({ stage, onClose, onSave }: EditStageModalProps) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (stage) form.setFieldsValue(stage)
  }, [stage, form])

  const handleOk = () => {
    const values = form.getFieldsValue()
    onSave(values.title)
    onClose()
  }

  return (
    <Modal
      open={!!stage}
      onCancel={onClose}
      onOk={handleOk}
      okText="Сохранить"
      cancelText="Отмена"
      okButtonProps={{ style: { background: '#ff6720', border: 'none' } }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <EditOutlined style={{ color: '#ff6720' }} />
          <span>Редактировать этап</span>
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
          name="title"
          label="Название этапа"
          rules={[{ required: true, message: 'Введите название' }]}
          style={{ marginBottom: 0 }}
        >
          <Input size="large" style={{ borderRadius: 8 }} />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditStageModal
