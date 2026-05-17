import { Modal, Form, Input } from 'antd'

interface AddPlanModalProps {
  open: boolean
  onClose: () => void
  onAdd: (values: { name: string; roleType: string }) => void
}

const AddPlanModal = ({ open, onClose, onAdd }: AddPlanModalProps) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    const values = form.getFieldsValue()
    if (!values.name) return
    onAdd(values)
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
      okText="Создать"
      cancelText="Отмена"
      okButtonProps={{ style: { background: '#ff6720', border: 'none' } }}
      title="Создать шаблон"
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
          <Input
            placeholder="Онбординг Java-разработчика"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        <Form.Item
          name="roleType"
          label="Роль / должность"
          style={{ marginBottom: 0 }}
        >
          <Input
            placeholder="Backend Developer"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddPlanModal
