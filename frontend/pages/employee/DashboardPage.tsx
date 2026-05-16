import { Row, Col } from 'antd'
import {
  CheckCircleOutlined,
  CalendarOutlined,
  FlagOutlined,
} from '@ant-design/icons'
import useAuthStore from '../../store/authStore'
import WelcomeCard from '../../components/dashboard/WelcomeCard'
import SurveyCard from '../../components/dashboard/SurveyCard'
import StatCard from '../../components/dashboard/StatCard'
import TaskList from '../../components/dashboard/TaskList'
import AchievementList from '../../components/dashboard/AchievementList'
import type { Task } from '../../components/dashboard/TaskList'
import type { Achievement } from '../../components/dashboard/AchievementList'

const mockTasks: Task[] = [
  {
    id: 1,
    title: 'Встреча с наставником',
    description:
      'Обсудить план на первый месяц, познакомиться и задать вопросы по процессам команды, инструментам разработки, ожиданиям от испытательного срока, правилам коммуникации внутри отдела и ближайшим приоритетам проекта',
    due: 'Сегодня',
    time: '11:00',
    done: false,
    priority: 'high',
  },
  {
    id: 3,
    title: 'Настроить рабочее окружение',
    description:
      'Установить необходимые программы согласно списку из confluence, получить доступы к системам через заявку в IT-отдел, настроить VPN, корпоративную почту, Slack, Jira и локальное окружение для разработки по инструкции из базы знаний',
    due: '17 мая',
    time: '12:00',
    done: false,
    priority: 'medium',
  },
  {
    id: 4,
    title: 'Познакомиться с командой',
    description:
      'Написать в общий чат команды короткое приветствие с рассказом о себе, договориться о коротком онлайн-знакомстве с каждым членом команды, узнать о текущих проектах, ролях и зонах ответственности коллег',
    due: '18 мая',
    time: '15:30',
    done: false,
    priority: 'low',
  },
  {
    id: 5,
    title: 'Заполнить анкету безопасности',
    description:
      'Пройти обязательный инструктаж по информационной безопасности и заполнить анкету в корпоративной системе согласно регламенту',
    due: '10 мая',
    time: '18:00',
    done: false,
    priority: 'high',
    overdue: true,
  },
]

const mockAchievements: Achievement[] = [
  {
    id: 1,
    title: 'Первый день',
    description: 'Вышел на работу в первый день',
    unlocked: true,
  },
  {
    id: 2,
    title: 'Первая задача',
    description: 'Выполнил первую задачу адаптации',
    unlocked: true,
  },
  {
    id: 3,
    title: 'Неделя в команде',
    description: 'Провёл первую неделю в компании',
    unlocked: true,
  },
  {
    id: 4,
    title: 'Этап пройден',
    description: 'Завершил один из этапов адаптации',
    unlocked: false,
  },
  {
    id: 5,
    title: 'Опрос заполнен',
    description: 'Заполнил еженедельный опрос',
    unlocked: false,
  },
]

const mockStats = {
  daysPassed: 12,
  totalDays: 90,
  completedTasks: 8,
  totalTasks: 24,
  currentStage: 'Погружение',
  stageNumber: 2,
  totalStages: 3,
}

const DashboardPage = () => {
  const { user } = useAuthStore()
  const taskPercent = Math.round(
    (mockStats.completedTasks / mockStats.totalTasks) * 100
  )
  const daysLeft = mockStats.totalDays - mockStats.daysPassed

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <Row gutter={16}>
        <Col span={12}>
          <WelcomeCard
            name={user?.name ?? 'Сотрудник'}
            daysPassed={mockStats.daysPassed}
            totalDays={mockStats.totalDays}
          />
        </Col>
        <Col span={12}>
          <SurveyCard filled={true} weekNumber={2} filledAt="10:30" />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={8}>
          <StatCard
            icon={<FlagOutlined style={{ color: '#ff6720', fontSize: 20 }} />}
            label="Текущий этап адаптации"
            value={mockStats.currentStage}
            sub={`Этап ${mockStats.stageNumber} из ${mockStats.totalStages}`}
            percent={Math.round(
              (mockStats.stageNumber / mockStats.totalStages) * 100
            )}
          />
        </Col>
        <Col span={8}>
          <StatCard
            icon={
              <CheckCircleOutlined style={{ color: '#ff6720', fontSize: 20 }} />
            }
            label="Задачи"
            value={`${mockStats.completedTasks} / ${mockStats.totalTasks}`}
            sub={`${taskPercent}% выполнено`}
            percent={taskPercent}
          />
        </Col>
        <Col span={8}>
          <StatCard
            icon={
              <CalendarOutlined style={{ color: '#ff6720', fontSize: 20 }} />
            }
            label="Период адаптации"
            value={`${mockStats.daysPassed} из ${mockStats.totalDays} дней`}
            sub={
              daysLeft > 0
                ? `До конца адаптации ${daysLeft} дней`
                : 'Адаптация завершена'
            }
            percent={Math.round(
              (mockStats.daysPassed / mockStats.totalDays) * 100
            )}
          />
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={16}>
          <TaskList tasks={mockTasks} />
        </Col>
        <Col span={8}>
          <AchievementList achievements={mockAchievements} />
        </Col>
      </Row>
    </div>
  )
}

export default DashboardPage
