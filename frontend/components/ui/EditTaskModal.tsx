import { useEffect } from 'react'
import { Modal, Form, Input, DatePicker } from 'antd'
import { EditOutlined } from '@ant-design/icons'

interface TaskToEdit {
  id: number
  title: string
  description?: string
  due: string
}

interface EditTaskModalProps {
  task: TaskToEdit | null
  onClose: () => void
  onSave: (values: Partial<TaskToEdit>) => void
}

const EditTaskModal = ({ task, onClose, onSave }: EditTaskModalProps) => {
  const [form] = Form.useForm()

  useEffect(() => {
    if (task)
      form.setFieldsValue({ title: task.title, description: task.description })
  }, [task, form])

  const handleOk = () => {
    const values = form.getFieldsValue()
    onSave({
      ...values,
      due: values.due ? values.due.format('D MMM · HH:mm') : task?.due,
    })
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
          <Input.TextArea rows={3} style={{ borderRadius: 8 }} />
        </Form.Item>
        <Form.Item name="due" label="Срок" style={{ marginBottom: 0 }}>
          <DatePicker
            showTime={{ format: 'HH:mm' }}
            format="D MMM · HH:mm"
            style={{ width: '100%', borderRadius: 8 }}
            size="large"
            placeholder="Выберите дату и время"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default EditTaskModal
