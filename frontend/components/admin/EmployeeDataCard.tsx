import { useState } from 'react'
import {
  Card,
  Button,
  Form,
  Input,
  Select,
  Modal,
  message,
  Typography,
  Spin,
  AutoComplete,
} from 'antd'
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useMentors, useDepartments } from '../../api/hooks/useAdmin'

const { Text } = Typography

interface EmployeeData {
  email: string
  position: string
  department: string
  mentor?: string | { id: number; full_name: string }
  mentor_id?: number | null
  plan: string
  plan_id?: number | null
  startDate: string
  role: 'employee' | 'mentor' | 'admin'
}

interface EmployeeDataCardProps {
  data: EmployeeData
  onSave: (values: Partial<EmployeeData>) => void
  userId?: number
}

const EmployeeDataCard = ({ data, onSave }: EmployeeDataCardProps) => {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form] = Form.useForm()

  const { data: mentors = [], isLoading: isMentorsLoading } = useMentors()
  const { data: departments = [], isLoading: isDepartmentsLoading } =
    useDepartments()

  const isLoading = isMentorsLoading || isDepartmentsLoading

  const handleSave = () => {
    const values = form.getFieldsValue()
    onSave(values)
    setEditing(false)
  }

  const mentorName =
    typeof data.mentor === 'string'
      ? data.mentor
      : data.mentor?.full_name || 'Не назначен'

  const mentorId =
    typeof data.mentor === 'object' && data.mentor?.id ? data.mentor.id : undefined

  const handleCancel = () => {
    const initialValues = {
      email: data.email,
      position: data.position,
      department: data.department,
      role: data.role,
      mentor: mentorId,
    }
    form.setFieldsValue(initialValues)
    setEditing(false)
  }

  const infoItems = [
    { label: 'Email', value: data.email },
    ...(data.role === 'employee'
      ? [
          { label: 'Наставник', value: mentorName },
          { label: 'План адаптации', value: data.plan },
          { label: 'Дата выхода', value: data.startDate },
        ]
      : [{ label: 'Дата в компании', value: data.startDate }]),
  ]

  return (
    <Card
      style={{ borderRadius: 12 }}
      bodyStyle={{ padding: '20px 24px' }}
      title={
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Text strong style={{ fontSize: 17 }}>
            Данные
          </Text>
          {data.role !== 'admin' &&
            (!editing ? (
              <Button
                icon={<EditOutlined />}
                type="text"
                style={{ color: '#ff6720' }}
                onClick={() => {
                  const initialValues = {
                    email: data.email,
                    position: data.position,
                    department: data.department,
                    role: data.role,
                    mentor: mentorId,
                  }
                  form.setFieldsValue(initialValues)
                  setEditing(true)
                }}
              >
                Изменить
              </Button>
            ) : (
              <div style={{ display: 'flex', gap: 4 }}>
                <Button
                  icon={<CloseOutlined />}
                  type="text"
                  style={{ color: '#bbb' }}
                  onClick={handleCancel}
                />
                <Button
                  icon={<SaveOutlined />}
                  type="text"
                  style={{ color: '#ff6720' }}
                  onClick={handleSave}
                />
              </div>
            ))}
        </div>
      }
    >
      {!editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {infoItems.map((item) => (
            <div key={item.label}>
              <Text
                style={{
                  fontSize: 14,
                  color: '#bbb',
                  display: 'block',
                  marginBottom: 2,
                }}
              >
                {item.label}
              </Text>
              <Text style={{ fontSize: 16, fontWeight: 500 }}>
                {item.value}
              </Text>
            </div>
          ))}

          {data.role !== 'admin' && (
            <div
              style={{
                marginTop: 4,
                paddingTop: 16,
                borderTop: '1px solid #f5f5f5',
              }}
            >
              <Button
                danger
                block
                style={{ borderRadius: 8 }}
                onClick={() => {
                  Modal.confirm({
                    title: 'Деактивировать сотрудника?',
                    content:
                      'Сотрудник потеряет доступ к системе. Данные сохранятся.',
                    okText: 'Деактивировать',
                    cancelText: 'Отмена',
                    okButtonProps: { danger: true },
                    onOk: () => {
                      message.success('Сотрудник деактивирован')
                      navigate('/admin')
                    },
                  })
                }}
              >
                Деактивировать
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Spin spinning={isLoading}>
          <Form form={form} layout="vertical" requiredMark={false}>
            <Form.Item name="email" label="Email" style={{ marginBottom: 12 }}>
              <Input size="large" style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item
              name="position"
              label="Должность"
              style={{ marginBottom: 12 }}
            >
              <Input size="large" style={{ borderRadius: 8 }} />
            </Form.Item>
            <Form.Item
              name="department"
              label="Отдел"
              style={{ marginBottom: 12 }}
            >
              <AutoComplete
                placeholder="Выберите или введите отдел"
                size="large"
                options={departments.map((d) => ({ label: d, value: d }))}
              />
            </Form.Item>
            <Form.Item name="role" label="Роль" style={{ marginBottom: 12 }}>
              <Select size="large">
                <Select.Option value="employee">Сотрудник</Select.Option>
                <Select.Option value="mentor">Наставник</Select.Option>
                <Select.Option value="admin">Администратор</Select.Option>
              </Select>
            </Form.Item>
            {data.role === 'employee' && (
              <Form.Item
                name="mentor"
                label="Наставник"
                style={{ marginBottom: 0 }}
              >
                <Select
                  size="large"
                  placeholder="Выберите наставника"
                  optionLabelProp="label"
                >
                  {mentors.map((m) => (
                    <Select.Option
                      key={m.id}
                      value={m.id}
                      label={m.full_name}
                    >
                      {m.full_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}
          </Form>
        </Spin>
      )}
    </Card>
  )
}

export default EmployeeDataCard
