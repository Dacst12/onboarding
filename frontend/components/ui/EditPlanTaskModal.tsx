import { useEffect } from 'react'
import { Modal, Form, Input, Select } from 'antd'
import { EditOutlined } from '@ant-design/icons'

const taskTypeLabel: Record<string, string> = {
  access: 'Выдача доступа',
  training: 'Обучение',
  meeting: 'Встреча',
}

export interface PlanTaskToEdit {
  id: number
  title: string
  description: string
  type: 'access' | 'training' | 'meeting'
  offsetDay: number
}

interface EditPlanTaskModalProps {
  task: PlanTaskToEdit | null
  onClose: () => void
  onSave: (values: Partial<PlanTaskToEdit>) => void
}

const EditPlanTaskModal = ({
  task,
  onClose,
  onSave,
}: EditPlanTaskModalProps) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (task) form.setFieldsValue(task)
  }, [task, form])

  const handleOk = () => {
    const values = form.getFieldsValue()
    onSave(values)
    onClose()
  }

  return (
    <Modal
      open={!!task}
      onCancel={onClose}
      onOk={handleOk}
      okText="Сохранить"
      cancelText="Отмена"
      okButtonProps={{ style: { background: '#ff6720', border: 'none' } }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <EditOutlined style={{ color: '#ff6720' }} />
          <span>Редактировать задачу</span>
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
          label="Название"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input size="large" style={{ borderRadius: 8 }} />
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <Input.TextArea rows={2} style={{ borderRadius: 8 }} />
        </Form.Item>
        <Form.Item name="type" label="Тип задачи">
          <Select size="large">
            {Object.entries(taskTypeLabel).map(([value, label]) => (
              <Select.Option key={value} value={value}>
                {label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="offsetDay"
          label="День от выхода сотрудника"
          style={{ marginBottom: 0 }}
        >
          <Input
            type="number"
            min={1}
            placeholder="Например: 1, 7, 14, 30"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditPlanTaskModal
