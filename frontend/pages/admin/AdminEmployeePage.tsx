import { useState } from 'react'
import { Row, Col, Button, Tabs } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import EmployeeProfileCard from '../../components/admin/EmployeeProfileCard'
import EmployeeProgressCard from '../../components/admin/EmployeeProgressCard'
import EmployeeDataCard from '../../components/admin/EmployeeDataCard'
import EmployeeEmptyPlan from '../../components/admin/EmployeeEmptyPlan'
import EmployeeTaskList from '../../components/admin/EmployeeTaskList'
import EmployeeSurveyList from '../../components/admin/EmployeeSurveyList'
import type { AdminTask } from '../../components/admin/EmployeeTaskList'
import { Card } from 'antd'

const mockEmployee = {
  id: 1,
  name: 'Иван Петров',
  email: 'ivan@company.com',
  position: 'Frontend Developer',
  department: 'Разработка',
  team: 'Frontend',
  mentor: 'Пётр Иванов',
  plan: 'Онбординг разработчика',
  startDate: '5 мая 2025',
  role: 'employee' as 'employee' | 'mentor' | 'admin',
}

const mockSurveys = [
  {
    week: 1,
    mood: 3,
    clarity: 'partial',
    comment: 'Пока разбираюсь',
    date: '9 мая 2025',
  },
  {
    week: 2,
    mood: 4,
    clarity: 'yes',
    comment: 'Стало понятнее, команда помогает',
    date: '16 мая 2025',
  },
]

const initialTasks: AdminTask[] = [
  {
    id: 1,
    title: 'Встреча с наставником',
    description:
      'Обсудить план на первый месяц, познакомиться и задать вопросы по процессам команды',
    stage: 'Знакомство',
    done: true,
    due: '1 мая · 11:00',
    overdue: false,
  },
  {
    id: 2,
    title: 'Прочитать регламент',
    description:
      'Ознакомиться с внутренними правилами, политиками и процессами согласования задач',
    stage: 'Знакомство',
    done: true,
    due: '3 мая · 18:00',
    overdue: false,
  },
  {
    id: 3,
    title: 'Настроить окружение',
    description:
      'Установить необходимые программы, получить доступы к системам и настроить VPN',
    stage: 'Знакомство',
    done: true,
    due: '5 мая · 12:00',
    overdue: false,
  },
  {
    id: 4,
    title: 'Первый pull request',
    description:
      'Создать первый PR с небольшим изменением и пройти код-ревью у наставника',
    stage: 'Погружение',
    done: true,
    due: '10 мая · 12:00',
    overdue: false,
  },
  {
    id: 5,
    title: 'Провести код-ревью',
    description:
      'Самостоятельно провести ревью для одного из коллег по стандартам команды',
    stage: 'Погружение',
    done: false,
    due: '17 мая · 15:00',
    overdue: false,
  },
  {
    id: 6,
    title: 'Заполнить анкету безопасности',
    description:
      'Пройти инструктаж по информационной безопасности и заполнить анкету',
    stage: 'Погружение',
    done: false,
    due: '10 мая · 18:00',
    overdue: true,
  },
  {
    id: 7,
    title: 'Разобраться с архитектурой',
    description:
      'Изучить структуру проекта, основные модули и паттерны используемые в команде',
    stage: 'Погружение',
    done: false,
    due: '20 мая · 18:00',
    overdue: false,
  },
]

const AdminEmployeePage = () => {
  const navigate = useNavigate()
  const [employee, setEmployee] = useState(mockEmployee)
  const [tasks, setTasks] = useState(initialTasks)

  const tabs = [
    {
      key: 'tasks',
      label: <span style={{ fontSize: 15 }}>Задачи</span>,
      children: <EmployeeTaskList tasks={tasks} onTasksChange={setTasks} />,
    },
    {
      key: 'surveys',
      label: <span style={{ fontSize: 15 }}>Опросы</span>,
      children: <EmployeeSurveyList surveys={mockSurveys} />,
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/admin')}
        style={{ color: '#ff6720', padding: 0, alignSelf: 'flex-start' }}
      >
        Назад
      </Button>

      <Row gutter={24}>
        <Col span={8}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <EmployeeProfileCard
              name={employee.name}
              position={employee.position}
              department={employee.department}
              team={employee.team}
              role={employee.role}
            />

            {employee.role === 'employee' && (
              <EmployeeProgressCard tasks={tasks} />
            )}

            <EmployeeDataCard
              data={employee}
              onSave={(values) =>
                setEmployee((prev) => ({ ...prev, ...values }))
              }
            />
          </div>
        </Col>

        <Col span={16}>
          {employee.role === 'employee' ? (
            <Card
              style={{ borderRadius: 12 }}
              bodyStyle={{ padding: '0 24px 24px' }}
            >
              <Tabs items={tabs} />
            </Card>
          ) : (
            <EmployeeEmptyPlan role={employee.role as 'mentor' | 'admin'} />
          )}
        </Col>
      </Row>
    </div>
  )
}

export default AdminEmployeePage
