import { useState } from 'react'
import { Row, Col, Button, Modal, Form, Input, DatePicker } from 'antd'
import { useNavigate } from 'react-router-dom'
import { ArrowLeftOutlined } from '@ant-design/icons'
import RoadmapSidebar from '../../components/roadmap/RoadmapSidebar'
import TaskModal from '../../components/ui/TaskModal'
import MenteeHeader from '../../components/mentor/MenteeHeader'
import MenteeStageCard from '../../components/mentor/MenteeStageCard'
import type { ModalTask } from '../../components/ui/TaskModal'
import type { Stage } from '../../components/roadmap/types'

const mockMentee = {
  id: 1,
  name: 'Иван Петров',
  position: 'Frontend Developer',
  department: 'Разработка',
  startDate: '5 мая 2025',
  completedTasks: 8,
  totalTasks: 12,
  lastSurvey: { week: 2, filled: true, mood: 4 },
}

const mockStages: Stage[] = [
  {
    id: 1,
    title: 'Знакомство',
    durationDays: 14,
    status: 'done',
    tasks: [
      {
        id: 1,
        title: 'Встреча с наставником',
        description: 'Обсудить план на первый месяц',
        done: true,
        due: '1 мая · 11:00',
      },
      {
        id: 2,
        title: 'Прочитать регламент',
        description: 'Ознакомиться с внутренними правилами',
        done: true,
        due: '3 мая · 18:00',
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
        id: 3,
        title: 'Первый pull request',
        description: 'Создать первый PR и пройти код-ревью',
        done: true,
        due: '10 мая · 12:00',
      },
      {
        id: 4,
        title: 'Провести код-ревью',
        description: 'Самостоятельно провести ревью коллеги',
        done: false,
        due: '17 мая · 15:00',
      },
      {
        id: 5,
        title: 'Заполнить анкету безопасности',
        description: 'Пройти инструктаж по ИБ',
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
        id: 6,
        title: 'Провести демо',
        description: 'Демонстрация работы для команды',
        done: false,
        due: '1 июня · 11:00',
      },
      {
        id: 7,
        title: 'Закрыть первый спринт',
        description: 'Самостоятельно закрыть спринт',
        done: false,
        due: '15 июня · 18:00',
      },
    ],
  },
]

const MentorEmployeePage = () => {
  const navigate = useNavigate()
  const [stages, setStages] = useState(mockStages)
  const [selectedTask, setSelectedTask] = useState<ModalTask | null>(null)
  const [addTaskModal, setAddTaskModal] = useState<{
    open: boolean
    stageId: number | null
  }>({ open: false, stageId: null })
  const [form] = Form.useForm()

  const handleAddTask = () => {
    const values = form.getFieldsValue()
    if (!addTaskModal.stageId || !values.title) return

    const newTask = {
      id: Date.now(),
      title: values.title,
      description: values.description ?? '',
      done: false,
      due: values.due ? values.due.format('D MMM · HH:mm') : '—',
      isCustom: true as const,
    }

    setStages((prev) =>
      prev.map((stage) =>
        stage.id === addTaskModal.stageId
          ? { ...stage, tasks: [...stage.tasks, newTask] }
          : stage
      )
    )

    form.resetFields()
    setAddTaskModal({ open: false, stageId: null })
  }

  const handleDeleteTask = (stageId: number, taskId: number) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? { ...stage, tasks: stage.tasks.filter((t) => t.id !== taskId) }
          : stage
      )
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Button
        type="text"
        icon={<ArrowLeftOutlined />}
        onClick={() => navigate('/mentor')}
        style={{ color: '#ff6720', padding: 0, alignSelf: 'flex-start' }}
      >
        Назад
      </Button>

      <MenteeHeader {...mockMentee} />

      <Row gutter={24} align="stretch">
        <Col span={5}>
          <RoadmapSidebar
            name="План адаптации"
            daysPassed={12}
            totalDays={90}
            stages={stages}
          />
        </Col>
        <Col span={19}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {stages.map((stage) => (
              <MenteeStageCard
                key={stage.id}
                stage={stage}
                onTaskClick={setSelectedTask}
                onAddTask={(stageId) =>
                  setAddTaskModal({ open: true, stageId })
                }
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>
        </Col>
      </Row>

      <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />

      <Modal
        open={addTaskModal.open}
        onCancel={() => setAddTaskModal({ open: false, stageId: null })}
        onOk={handleAddTask}
        okText="Добавить"
        cancelText="Отмена"
        okButtonProps={{ style: { background: '#ff6720', border: 'none' } }}
        title="Добавить задачу"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="title"
            label="Название"
            rules={[{ required: true, message: 'Введите название' }]}
          >
            <Input
              placeholder="Название задачи"
              size="large"
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item name="description" label="Описание">
            <Input.TextArea
              placeholder="Описание задачи"
              rows={3}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>
          <Form.Item name="due" label="Срок" style={{ marginBottom: 0 }}>
            <DatePicker
              showTime
              style={{ width: '100%', borderRadius: 8 }}
              size="large"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default MentorEmployeePage
