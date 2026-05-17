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
} from 'antd'
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

const mockMentors = ['Пётр Иванов', 'Мария Козлова']
const mockPlans = [
  'Онбординг разработчика',
  'Онбординг QA',
  'Онбординг дизайнера',
]
const mockDepartments = [
  'Разработка',
  'Дизайн',
  'Продукт',
  'Инфраструктура',
  'HR',
]

interface EmployeeData {
  email: string
  position: string
  department: string
  mentor: string
  plan: string
  startDate: string
  role: 'employee' | 'mentor' | 'admin'
}

interface EmployeeDataCardProps {
  data: EmployeeData
  onSave: (values: Partial<EmployeeData>) => void
}

const EmployeeDataCard = ({ data, onSave }: EmployeeDataCardProps) => {
  const navigate = useNavigate()
  const [editing, setEditing] = useState(false)
  const [form] = Form.useForm()

  const handleSave = () => {
    const values = form.getFieldsValue()
    onSave(values)
    setEditing(false)
    message.success('Данные сохранены')
  }

  const handleCancel = () => {
    form.setFieldsValue(data)
    setEditing(false)
  }

  const infoItems = [
    { label: 'Email', value: data.email },
    ...(data.role === 'employee'
      ? [
          { label: 'Наставник', value: data.mentor },
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
                  form.setFieldsValue(data)
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
            <Select size="large">
              {mockDepartments.map((d) => (
                <Select.Option key={d} value={d}>
                  {d}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="role" label="Роль" style={{ marginBottom: 12 }}>
            <Select size="large">
              <Select.Option value="employee">Сотрудник</Select.Option>
              <Select.Option value="mentor">Наставник</Select.Option>
              <Select.Option value="admin">Администратор</Select.Option>
            </Select>
          </Form.Item>
          {data.role === 'employee' && (
            <>
              <Form.Item
                name="mentor"
                label="Наставник"
                style={{ marginBottom: 12 }}
              >
                <Select size="large">
                  {mockMentors.map((m) => (
                    <Select.Option key={m} value={m}>
                      {m}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="plan"
                label="План адаптации"
                style={{ marginBottom: 0 }}
              >
                <Select size="large">
                  {mockPlans.map((p) => (
                    <Select.Option key={p} value={p}>
                      {p}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </>
          )}
        </Form>
      )}
    </Card>
  )
}

export default EmployeeDataCard
