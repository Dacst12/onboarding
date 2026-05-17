import { useState } from 'react'
import { Typography, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import EmployeeTable from '../../components/admin/EmployeeTable'
import AddEmployeeModal from '../../components/admin/AddEmployeeModal'
import type { Employee } from '../../components/admin/EmployeeTable'

const { Title, Text } = Typography

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'Иван Петров',
    position: 'Frontend Developer',
    department: 'Разработка',
    mentor: 'Пётр Иванов',
    plan: 'Онбординг разработчика',
    completedTasks: 8,
    totalTasks: 12,
    lastMood: 4,
    startDate: '5 мая 2025',
    role: 'employee',
  },
  {
    id: 2,
    name: 'Анна Сидорова',
    position: 'QA Engineer',
    department: 'Разработка',
    mentor: 'Пётр Иванов',
    plan: 'Онбординг QA',
    completedTasks: 3,
    totalTasks: 12,
    lastMood: 2,
    startDate: '12 мая 2025',
    role: 'employee',
  },
  {
    id: 3,
    name: 'Дмитрий Ким',
    position: 'Backend Developer',
    department: 'Разработка',
    mentor: 'Мария Козлова',
    plan: 'Онбординг разработчика',
    completedTasks: 11,
    totalTasks: 12,
    lastMood: 5,
    startDate: '1 апреля 2025',
    role: 'employee',
  },
  {
    id: 4,
    name: 'Светлана Орлова',
    position: 'Designer',
    department: 'Дизайн',
    mentor: 'Мария Козлова',
    plan: 'Онбординг дизайнера',
    completedTasks: 5,
    totalTasks: 12,
    lastMood: 3,
    startDate: '20 мая 2025',
    role: 'employee',
  },
  {
    id: 5,
    name: 'Алексей Громов',
    position: 'DevOps Engineer',
    department: 'Инфраструктура',
    mentor: 'Пётр Иванов',
    plan: 'Онбординг DevOps',
    completedTasks: 2,
    totalTasks: 12,
    lastMood: null,
    startDate: '26 мая 2025',
    role: 'employee',
  },
  {
    id: 6,
    name: 'Пётр Иванов',
    position: 'Team Lead',
    department: 'Разработка',
    mentor: '—',
    plan: '—',
    completedTasks: 12,
    totalTasks: 12,
    lastMood: null,
    startDate: '1 января 2024',
    role: 'mentor',
  },
  {
    id: 7,
    name: 'Мария Козлова',
    position: 'Product Manager',
    department: 'Продукт',
    mentor: '—',
    plan: '—',
    completedTasks: 12,
    totalTasks: 12,
    lastMood: null,
    startDate: '1 февраля 2024',
    role: 'mentor',
  },
  {
    id: 8,
    name: 'Анна Смирнова',
    position: 'HR-менеджер',
    department: 'HR',
    mentor: '—',
    plan: '—',
    completedTasks: 12,
    totalTasks: 12,
    lastMood: null,
    startDate: '1 марта 2024',
    role: 'admin',
  },
]

const AdminDashboardPage = () => {
  const [employees, setEmployees] = useState(mockEmployees)
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Title level={4} style={{ margin: '0 0 4px' }}>
            Сотрудники
          </Title>
          <Text style={{ color: '#999', fontSize: 15 }}>
            {employees.length} человек в системе
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ background: '#ff6720', border: 'none', borderRadius: 10 }}
          onClick={() => setModalOpen(true)}
        >
          Добавить сотрудника
        </Button>
      </div>

      <EmployeeTable employees={employees} />

      <AddEmployeeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAdd={(employee) => setEmployees((prev) => [employee, ...prev])}
      />
    </div>
  )
}

export default AdminDashboardPage
