import { Modal, Form, Input } from 'antd'

interface AddStageModalProps {
  open: boolean
  onClose: () => void
  onAdd: (title: string) => void
}

const AddStageModal = ({ open, onClose, onAdd }: AddStageModalProps) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    const values = form.getFieldsValue()
    if (!values.title) return
    onAdd(values.title)
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
      title="Добавить этап"
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
          <Input
            placeholder="Первая неделя"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddStageModal
