import { Modal, Form, Input, Select, DatePicker } from 'antd'
import type { PlanStageData } from '../../api/types/admin'

interface AddCustomTaskModalProps {
  open: boolean
  onClose: () => void
  onAdd: (values: {
    stageId: number
    title: string
    description?: string
    dueDate: string
  }) => void
  stages: PlanStageData[]
}

const AddCustomTaskModal = ({ open, onClose, onAdd, stages }: AddCustomTaskModalProps) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    const values = form.getFieldsValue()
    if (!values.title || !values.stageId || !values.dueDate) {
      return
    }
    onAdd({
      stageId: values.stageId,
      title: values.title,
      description: values.description || undefined,
      dueDate: values.dueDate.format('YYYY-MM-DD'),
    })
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={() => {
        onClose()
        form.resetFields()
      }}
      onOk={handleOk}
      okText="Добавить"
      cancelText="Отмена"
      okButtonProps={{ style: { background: '#ff6720', border: 'none' } }}
      title="Добавить задачу"
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
        requiredMark={false}
      >
        <Form.Item
          name="stageId"
          label="Этап"
          rules={[{ required: true, message: 'Выберите этап' }]}
        >
          <Select placeholder="Выберите этап" size="large">
            {stages.map((stage) => (
              <Select.Option key={stage.id} value={stage.id}>
                {stage.title}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="title"
          label="Название"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input
            placeholder="Завершить установку ПО"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <Input.TextArea
            rows={2}
            placeholder="Описание задачи"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        <Form.Item
          name="dueDate"
          label="Дата выполнения"
          rules={[{ required: true, message: 'Выберите дату' }]}
          style={{ marginBottom: 0 }}
        >
          <DatePicker style={{ width: '100%', borderRadius: 8 }} size="large" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddCustomTaskModal
