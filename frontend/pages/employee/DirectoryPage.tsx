import { useState } from 'react'
import { Input, Typography, Row, Col } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import type { Employee } from '../../types/user'
import EmployeeCard from '../../components/directory/EmployeeCard'
import EmployeeModal from '../../components/directory/EmployeeModal'

const { Text, Title } = Typography

const mockEmployees: Employee[] = [
  {
    id: 1,
    name: 'Анна Смирнова',
    position: 'HR-менеджер',
    department: 'HR',
    team: 'Подбор персонала',
    email: 'anna@company.com',
    phone: '+7 999 111 22 33',
    responsibilities: 'Онбординг, адаптация, корпоративная культура',
    role: 'admin',
    startDate: '2024-01-01',
  },
  {
    id: 2,
    name: 'Пётр Иванов',
    position: 'Team Lead',
    department: 'Разработка',
    team: 'Frontend',
    email: 'petr@company.com',
    phone: '+7 999 222 33 44',
    responsibilities: 'Техническое руководство, код-ревью, архитектура',
    role: 'mentor',
    startDate: '2024-01-01',
  },
  {
    id: 3,
    name: 'Мария Козлова',
    position: 'Product Manager',
    department: 'Product',
    team: 'Core',
    email: 'maria@company.com',
    phone: '+7 999 333 44 55',
    responsibilities: 'Роадмап продукта, приоритизация, метрики',
    role: 'mentor',
    startDate: '2024-01-01',
  },
  {
    id: 4,
    name: 'Алексей Новиков',
    position: 'Backend Developer',
    department: 'Разработка',
    team: 'Backend',
    email: 'alex@company.com',
    responsibilities: 'API разработка, базы данных, DevOps',
    role: 'employee',
    startDate: '2024-03-01',
  },
  {
    id: 5,
    name: 'Елена Фёдорова',
    position: 'Designer',
    department: 'Дизайн',
    team: 'Product Design',
    email: 'elena@company.com',
    phone: '+7 999 444 55 66',
    responsibilities: 'UI/UX дизайн, дизайн-система, прототипирование',
    role: 'employee',
    startDate: '2024-02-01',
  },
  {
    id: 6,
    name: 'Дмитрий Соколов',
    position: 'QA Engineer',
    department: 'Разработка',
    team: 'QA',
    email: 'dmitry@company.com',
    responsibilities: 'Тестирование, автотесты, баг-репорты',
    role: 'employee',
    startDate: '2024-03-15',
  },
  {
    id: 7,
    name: 'Ольга Морозова',
    position: 'Frontend Developer',
    department: 'Разработка',
    team: 'Frontend',
    email: 'olga@company.com',
    phone: '+7 999 555 66 77',
    responsibilities: 'React разработка, производительность, доступность',
    role: 'employee',
    startDate: '2024-04-01',
  },
  {
    id: 8,
    name: 'Сергей Волков',
    position: 'DevOps Engineer',
    department: 'Инфраструктура',
    team: 'DevOps',
    email: 'sergey@company.com',
    responsibilities: 'CI/CD, облачная инфраструктура, мониторинг',
    role: 'employee',
    startDate: '2024-02-15',
  },
]

const DirectoryPage = () => {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Employee | null>(null)

  const filtered = mockEmployees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase()) ||
      e.team.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <Title level={4} style={{ margin: 0 }}>
            Справочник сотрудников
          </Title>
          <Text style={{ color: '#999', fontSize: 15 }}>
            {filtered.length} сотрудников
          </Text>
        </div>
        <Input
          prefix={<SearchOutlined style={{ color: '#bbb' }} />}
          placeholder="Поиск по имени, отделу, должности..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300, borderRadius: 10 }}
          size="large"
        />
      </div>

      <Row gutter={[16, 16]}>
        {filtered.map((employee) => (
          <Col key={employee.id} span={6}>
            <EmployeeCard
              employee={employee}
              onClick={() => setSelected(employee)}
            />
          </Col>
        ))}
      </Row>

      <EmployeeModal employee={selected} onClose={() => setSelected(null)} />
    </div>
  )
}

export default DirectoryPage
