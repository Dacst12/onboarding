import { Modal, Form, Input, Select, DatePicker } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import type { Employee } from './EmployeeTable'

const mockMentors = ['Пётр Иванов', 'Мария Козлова']
const mockPlans = [
  'Онбординг разработчика',
  'Онбординг QA',
  'Онбординг дизайнера',
  'Онбординг DevOps',
]
const mockDepartments = [
  'Разработка',
  'Дизайн',
  'Продукт',
  'Инфраструктура',
  'HR',
]

interface AddEmployeeModalProps {
  open: boolean
  onClose: () => void
  onAdd: (employee: Employee) => void
}

const AddEmployeeModal = ({ open, onClose, onAdd }: AddEmployeeModalProps) => {
  const [form] = Form.useForm()

  const handleOk = () => {
    const values = form.getFieldsValue()
    if (!values.name || !values.email) return

    onAdd({
      id: Date.now(),
      name: values.name,
      email: values.email,
      position: values.position ?? '—',
      department: values.department ?? '—',
      mentor: values.mentor ?? '—',
      plan: values.plan ?? '—',
      completedTasks: 0,
      totalTasks: 12,
      lastMood: null,
      startDate: values.startDate
        ? values.startDate.format('D MMMM YYYY')
        : '—',
      role: values.role ?? 'employee',
    })

    form.resetFields()
    onClose()
  }

  const handleCancel = () => {
    form.resetFields()
    onClose()
  }

  return (
    <Modal
      open={open}
      onCancel={handleCancel}
      onOk={handleOk}
      okText="Добавить"
      cancelText="Отмена"
      okButtonProps={{ style: { background: '#ff6720', border: 'none' } }}
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <UserAddOutlined style={{ color: '#ff6720' }} />
          <span>Добавить сотрудника</span>
        </div>
      }
      width={560}
    >
      <Form
        form={form}
        layout="vertical"
        style={{ marginTop: 16 }}
        requiredMark={false}
      >
        <Form.Item
          name="name"
          label="Имя"
          rules={[{ required: true, message: 'Введите имя' }]}
        >
          <Input
            placeholder="Иван Петров"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Введите email' },
            { type: 'email', message: 'Некорректный email' },
          ]}
        >
          <Input
            placeholder="ivan@company.com"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        <Form.Item name="position" label="Должность">
          <Input
            placeholder="Frontend Developer"
            size="large"
            style={{ borderRadius: 8 }}
          />
        </Form.Item>
        <Form.Item name="department" label="Отдел">
          <Select placeholder="Выберите отдел" size="large">
            {mockDepartments.map((d) => (
              <Select.Option key={d} value={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="role" label="Роль в системе">
          <Select placeholder="Выберите роль" size="large">
            <Select.Option value="employee">Сотрудник</Select.Option>
            <Select.Option value="mentor">Наставник</Select.Option>
            <Select.Option value="admin">Администратор</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="mentor" label="Наставник">
          <Select placeholder="Выберите наставника" size="large">
            {mockMentors.map((m) => (
              <Select.Option key={m} value={m}>
                {m}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="plan" label="Шаблон адаптации">
          <Select placeholder="Выберите шаблон" size="large">
            {mockPlans.map((p) => (
              <Select.Option key={p} value={p}>
                {p}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="startDate"
          label="Дата выхода"
          style={{ marginBottom: 0 }}
        >
          <DatePicker style={{ width: '100%', borderRadius: 8 }} size="large" />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddEmployeeModal
