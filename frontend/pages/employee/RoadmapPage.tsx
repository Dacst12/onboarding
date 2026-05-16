import { Row, Col } from 'antd'
import { useState } from 'react'
import RoadmapSidebar from '../../components/roadmap/RoadmapSidebar'
import RoadmapStageCard from '../../components/roadmap/RoadmapStageCard'
import TaskModal from '../../components/ui/TaskModal'
import type { Stage, SelectedTask } from '../../components/roadmap/types'

const mockPlan = {
  name: 'Адаптация Frontend разработчика',
  totalDays: 90,
  daysPassed: 12,
  stages: [
    {
      id: 1,
      title: 'Знакомство',
      durationDays: 14,
      status: 'done',
      tasks: [
        {
          id: 1,
          title: 'Встреча с наставником',
          description:
            'Обсудить план на первый месяц, познакомиться и задать вопросы по процессам команды, инструментам разработки, ожиданиям от испытательного срока, правилам коммуникации внутри отдела и ближайшим приоритетам проекта на ближайшие недели',
          done: true,
          due: '1 мая · 11:00',
        },
        {
          id: 2,
          title: 'Прочитать регламент компании',
          description:
            'Ознакомиться с внутренними правилами, политиками, процессами согласования задач и документов, структурой отделов, корпоративными стандартами поведения, дресс-кода и порядком оформления отпусков',
          done: true,
          due: '3 мая · 18:00',
        },
        {
          id: 3,
          title: 'Настроить рабочее окружение',
          description:
            'Установить необходимые программы согласно списку из confluence, получить доступы к системам через заявку в IT-отдел, настроить VPN, корпоративную почту, Slack и Jira',
          done: true,
          due: '5 мая · 12:00',
        },
        {
          id: 4,
          title: 'Познакомиться с командой',
          description:
            'Написать в общий чат команды короткое приветствие с рассказом о себе, договориться о коротком онлайн-знакомстве с каждым членом команды и узнать о текущих проектах',
          done: true,
          due: '7 мая · 15:30',
        },
      ],
    },
    {
      id: 2,
      title: 'Погружение',
      durationDays: 30,
      status: 'current',
      tasks: [
        {
          id: 5,
          title: 'Первый pull request',
          description:
            'Создать первый pull request с небольшим изменением, пройти код-ревью у наставника и получить конструктивный фидбек от команды по стилю и качеству кода',
          done: true,
          due: '10 мая · 12:00',
        },
        {
          id: 6,
          title: 'Провести код-ревью',
          description:
            'Самостоятельно провести полноценное код-ревью для одного из коллег, оставить конструктивные и аргументированные комментарии согласно принятым стандартам команды',
          done: false,
          due: '17 мая · 15:00',
        },
        {
          id: 7,
          title: 'Разобраться с архитектурой',
          description:
            'Изучить структуру проекта, основные модули, паттерны и подходы используемые в команде, задать вопросы наставнику по неясным моментам и задокументировать выводы',
          done: false,
          due: '20 мая · 18:00',
        },
        {
          id: 8,
          title: 'Заполнить анкету безопасности',
          description:
            'Пройти обязательный инструктаж по информационной безопасности, изучить политику компании и заполнить анкету в корпоративной системе согласно регламенту отдела безопасности',
          done: false,
          due: '10 мая · 18:00',
          overdue: true,
        },
      ],
    },
    {
      id: 3,
      title: 'Самостоятельность',
      durationDays: 46,
      status: 'locked',
      tasks: [
        {
          id: 9,
          title: 'Провести демо для команды',
          description:
            'Подготовить и провести полноценную демонстрацию выполненной работы для всей команды, ответить на вопросы и собрать структурированную обратную связь',
          done: false,
          due: '1 июня · 11:00',
        },
        {
          id: 10,
          title: 'Закрыть первый спринт',
          description:
            'Полностью самостоятельно спланировать и закрыть спринт: декомпозиция задач, оценка трудозатрат, выполнение и финальное демо для стейкхолдеров',
          done: false,
          due: '15 июня · 18:00',
        },
        {
          id: 11,
          title: 'Получить оценку наставника',
          description:
            'Провести финальную встречу с наставником, обсудить итоги всего периода адаптации, сильные стороны, зоны роста и дальнейший план развития в компании',
          done: false,
          due: '30 июня · 12:00',
        },
      ],
    },
  ] as Stage[],
}

const RoadmapPage = () => {
  const [selectedTask, setSelectedTask] = useState<SelectedTask | null>(null)

  const handleToggle = () => {
    if (!selectedTask || selectedTask.stageStatus === 'locked') return
    setSelectedTask((prev) => (prev ? { ...prev, done: !prev.done } : null))
  }

  return (
    <Row gutter={24} align="stretch">
      <Col span={5}>
        <RoadmapSidebar
          name={mockPlan.name}
          daysPassed={mockPlan.daysPassed}
          totalDays={mockPlan.totalDays}
          stages={mockPlan.stages}
        />
      </Col>
      <Col span={19}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {mockPlan.stages.map((stage) => (
            <RoadmapStageCard
              key={stage.id}
              stage={stage}
              onTaskClick={setSelectedTask}
            />
          ))}
        </div>
      </Col>
      <TaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onToggle={handleToggle}
        disabled={selectedTask?.stageStatus === 'locked'}
        disabledText="Этап ещё не начат"
      />
    </Row>
  )
}

export default RoadmapPage
