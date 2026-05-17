import { Modal, Form, Input } from 'antd'

interface AddTaskModalProps {
  open: boolean
  onClose: () => void
  onAdd: (values: {
    title: string
    description: string
    offsetDay: number
  }) => void
}

const AddTaskModal = ({ open, onClose, onAdd }: AddTaskModalProps) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    const values = form.getFieldsValue()
    if (!values.title) return
    onAdd({ ...values, offsetDay: Number(values.offsetDay ?? 1) })
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
          name="title"
          label="Название"
          rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input
            placeholder="Получить доступ к GitLab"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        <Form.Item name="description" label="Описание">
          <Input.TextArea rows={2} style={{ borderRadius: 8 }} />
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

export default AddTaskModal
