import { Modal, Form, Input, Select, DatePicker, Spin, AutoComplete } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { useMentors, useDepartments, useTemplatePlanNames } from '../../api/hooks/useAdmin'
import type { User } from '../../types/user'

interface AddEmployeeModalProps {
  open: boolean
  onClose: () => void
  onAdd: (employee: User) => void
}

const AddEmployeeModal = ({ open, onClose, onAdd }: AddEmployeeModalProps) => {
  const [form] = Form.useForm()
  const selectedRole = Form.useWatch('role', form)

  const { data: mentors = [], isLoading: isMentorsLoading } = useMentors()
  const { data: departments = [], isLoading: isDepartmentsLoading } =
    useDepartments()
  const { data: plans = [], isLoading: isPlansLoading } = useTemplatePlanNames()

  const isLoading = isMentorsLoading || isDepartmentsLoading || isPlansLoading
  const isNewEmployee = selectedRole === 'new_employee' || (!selectedRole && true)

  const handleOk = () => {
    const values = form.getFieldsValue()
    const role = values.role || 'new_employee'

    if (!values.name || !values.email || !values.password) return
    if (role === 'new_employee' && (!values.plan || !values.startDate)) return

    let startDateStr: string | null = null
    if (role === 'new_employee' && values.startDate) {
      // Dayjs object - format as YYYY-MM-DD
      startDateStr = values.startDate.format('YYYY-MM-DD')
    }

    const newEmployee: User & {
      password: string
      template_id?: number | null
      start_date?: string | null
    } = {
      id: 0,
      full_name: values.name,
      email: values.email,
      password: values.password,
      position: values.position || null,
      department: values.department || null,
      role: role as 'new_employee' | 'mentor' | 'admin',
      is_active: true,
      created_at: new Date().toISOString(),
      mentor_id: role === 'new_employee' ? values.mentor : null,
      mentor: values.mentor && role === 'new_employee'
        ? mentors.find((m) => m.id === values.mentor)
        : undefined,
      phone: null,
      telegram: null,
      responsibility_tags: null,
      template_id: role === 'new_employee' ? values.plan : null,
      start_date: startDateStr,
    }

    onAdd(newEmployee as User)

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
      <Spin spinning={isLoading}>
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
          <Form.Item
            name="password"
            label="Пароль"
            rules={[
              { required: true, message: 'Установите пароль' },
              { min: 6, message: 'Пароль должен быть минимум 6 символов' },
            ]}
          >
            <Input.Password
              placeholder="••••••••"
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
            <AutoComplete
              placeholder="Выберите или введите отдел"
              size="large"
              options={departments.map((d) => ({ label: d, value: d }))}
            />
          </Form.Item>
          <Form.Item name="role" label="Роль в системе">
            <Select placeholder="Выберите роль" size="large">
              <Select.Option value="new_employee">Сотрудник</Select.Option>
              <Select.Option value="mentor">Наставник</Select.Option>
              <Select.Option value="admin">Администратор</Select.Option>
            </Select>
          </Form.Item>
          {isNewEmployee && (
            <>
              <Form.Item name="mentor" label="Наставник">
                <Select placeholder="Выберите наставника" size="large">
                  {mentors.map((m) => (
                    <Select.Option key={m.id} value={m.id}>
                      {m.full_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="plan"
                label="Шаблон адаптации"
                rules={[
                  {
                    required: true,
                    message: 'Выберите шаблон адаптации',
                  },
                ]}
              >
                <Select placeholder="Выберите шаблон" size="large">
                  {plans.map((p) => (
                    <Select.Option key={p.id} value={p.id}>
                      {p.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="startDate"
                label="Дата выхода"
                style={{ marginBottom: 0 }}
                rules={[
                  {
                    required: true,
                    message: 'Выберите дату выхода',
                  },
                ]}
              >
                <DatePicker
                  style={{ width: '100%', borderRadius: 8 }}
                  size="large"
                />
              </Form.Item>
            </>
          )}
        </Form>
      </Spin>
    </Modal>
  )
}

export default AddEmployeeModal
