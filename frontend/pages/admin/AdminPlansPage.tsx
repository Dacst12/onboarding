import { useState } from 'react'
import { Typography, Button, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PlanCard from '../../components/admin/plans/PlanCard'
import AddPlanModal from '../../components/admin/plans/AddPlanModal'
import EditPlanModal from '../../components/admin/plans/EditPlanModal'
import AddStageModal from '../../components/admin/plans/AddStageModal'
import EditStageModal from '../../components/admin/plans/EditStageModal'
import AddTaskModal from '../../components/admin/plans/AddTaskModal'
import EditPlanTaskModal from '../../components/ui/EditPlanTaskModal'
import type {
  Plan,
  PlanStage,
  PlanTask,
} from '../../components/admin/plans/types'
import type { PlanTaskToEdit } from '../../components/ui/EditPlanTaskModal'

const { Title, Text } = Typography

const initialPlans: Plan[] = [
  {
    id: 1,
    name: 'Онбординг разработчика',
    roleType: 'Frontend / Backend Developer',
    stages: [
      {
        id: 1,
        title: 'Первая неделя',
        tasks: [
          {
            id: 1,
            title: 'Встреча с наставником',
            description: 'Познакомиться и обсудить план',
            type: 'meeting',
            offsetDay: 1,
          },
          {
            id: 2,
            title: 'Получить доступ к GitLab',
            description: 'Запросить доступ через IT-отдел',
            type: 'access',
            offsetDay: 1,
          },
          {
            id: 3,
            title: 'Прочитать регламент',
            description: 'Ознакомиться с внутренними правилами',
            type: 'training',
            offsetDay: 2,
          },
        ],
      },
      {
        id: 2,
        title: 'Второй месяц',
        tasks: [
          {
            id: 4,
            title: 'Первый pull request',
            description: 'Создать PR и пройти ревью',
            type: 'training',
            offsetDay: 14,
          },
          {
            id: 5,
            title: 'Провести код-ревью',
            description: 'Самостоятельно ревьювнуть коллегу',
            type: 'meeting',
            offsetDay: 21,
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Онбординг QA',
    roleType: 'QA Engineer',
    stages: [
      {
        id: 3,
        title: 'Первая неделя',
        tasks: [
          {
            id: 6,
            title: 'Встреча с наставником',
            description: 'Познакомиться и обсудить план',
            type: 'meeting',
            offsetDay: 1,
          },
          {
            id: 7,
            title: 'Получить доступ к TestRail',
            description: 'Запросить доступ к системе тестирования',
            type: 'access',
            offsetDay: 1,
          },
        ],
      },
    ],
  },
]

const AdminPlansPage = () => {
  const [plans, setPlans] = useState(initialPlans)

  const [addPlanModal, setAddPlanModal] = useState(false)
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null)

  const [addStageModal, setAddStageModal] = useState<{
    open: boolean
    planId: number | null
  }>({ open: false, planId: null })
  const [editingStage, setEditingStage] = useState<{
    planId: number
    stage: PlanStage
  } | null>(null)

  const [addTaskModal, setAddTaskModal] = useState<{
    open: boolean
    planId: number | null
    stageId: number | null
  }>({ open: false, planId: null, stageId: null })
  const [editingTask, setEditingTask] = useState<PlanTaskToEdit | null>(null)
  const [editingTaskMeta, setEditingTaskMeta] = useState<{
    planId: number
    stageId: number
  } | null>(null)

  const handleAddPlan = (values: { name: string; roleType: string }) => {
    setPlans((prev) => [...prev, { id: Date.now(), ...values, stages: [] }])
  }

  const handleSavePlan = (values: { name: string; roleType: string }) => {
    setPlans((prev) =>
      prev.map((p) => (p.id === editingPlan?.id ? { ...p, ...values } : p))
    )
    setEditingPlan(null)
  }

  const handleDeletePlan = (planId: number) => {
    Modal.confirm({
      title: 'Удалить шаблон?',
      content: 'Шаблон будет удалён безвозвратно.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: () => setPlans((prev) => prev.filter((p) => p.id !== planId)),
    })
  }

  const handleAddStage = (title: string) => {
    if (!addStageModal.planId) return
    setPlans((prev) =>
      prev.map((p) =>
        p.id === addStageModal.planId
          ? {
              ...p,
              stages: [...p.stages, { id: Date.now(), title, tasks: [] }],
            }
          : p
      )
    )
  }

  const handleSaveStage = (title: string) => {
    if (!editingStage) return
    setPlans((prev) =>
      prev.map((p) =>
        p.id === editingStage.planId
          ? {
              ...p,
              stages: p.stages.map((s) =>
                s.id === editingStage.stage.id ? { ...s, title } : s
              ),
            }
          : p
      )
    )
    setEditingStage(null)
  }

  const handleDeleteStage = (planId: number, stageId: number) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? { ...p, stages: p.stages.filter((s) => s.id !== stageId) }
          : p
      )
    )
  }

  const handleAddTask = (values: {
    title: string
    description: string
    type: string
    offsetDay: number
  }) => {
    if (!addTaskModal.planId || !addTaskModal.stageId) return
    const newTask: PlanTask = {
      id: Date.now(),
      ...values,
      type: values.type as PlanTask['type'],
    }
    setPlans((prev) =>
      prev.map((p) =>
        p.id === addTaskModal.planId
          ? {
              ...p,
              stages: p.stages.map((s) =>
                s.id === addTaskModal.stageId
                  ? { ...s, tasks: [...s.tasks, newTask] }
                  : s
              ),
            }
          : p
      )
    )
  }

  const handleSaveTask = (values: Partial<PlanTaskToEdit>) => {
    if (!editingTaskMeta || !editingTask) return
    setPlans((prev) =>
      prev.map((p) =>
        p.id === editingTaskMeta.planId
          ? {
              ...p,
              stages: p.stages.map((s) =>
                s.id === editingTaskMeta.stageId
                  ? {
                      ...s,
                      tasks: s.tasks.map((t) =>
                        t.id === editingTask.id ? { ...t, ...values } : t
                      ),
                    }
                  : s
              ),
            }
          : p
      )
    )
  }

  const handleDeleteTask = (
    planId: number,
    stageId: number,
    taskId: number
  ) => {
    setPlans((prev) =>
      prev.map((p) =>
        p.id === planId
          ? {
              ...p,
              stages: p.stages.map((s) =>
                s.id === stageId
                  ? { ...s, tasks: s.tasks.filter((t) => t.id !== taskId) }
                  : s
              ),
            }
          : p
      )
    )
  }

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
            Шаблоны планов
          </Title>
          <Text style={{ color: '#999', fontSize: 17 }}>
            {plans.length} шаблона
          </Text>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          style={{ background: '#ff6720', border: 'none', borderRadius: 10 }}
          onClick={() => setAddPlanModal(true)}
        >
          Создать шаблон
        </Button>
      </div>

      {plans.map((plan) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          onEdit={(p) => {
            setEditingPlan(p)
          }}
          onDelete={handleDeletePlan}
          onAddStage={(planId) => setAddStageModal({ open: true, planId })}
          onEditStage={(planId, stage) => setEditingStage({ planId, stage })}
          onDeleteStage={handleDeleteStage}
          onAddTask={(planId, stageId) =>
            setAddTaskModal({ open: true, planId, stageId })
          }
          onEditTask={(task, planId, stageId) => {
            setEditingTask(task)
            setEditingTaskMeta({ planId, stageId })
          }}
          onDeleteTask={handleDeleteTask}
        />
      ))}

      <AddPlanModal
        open={addPlanModal}
        onClose={() => setAddPlanModal(false)}
        onAdd={handleAddPlan}
      />

      <EditPlanModal
        plan={editingPlan}
        onClose={() => setEditingPlan(null)}
        onSave={handleSavePlan}
      />

      <AddStageModal
        open={addStageModal.open}
        onClose={() => setAddStageModal({ open: false, planId: null })}
        onAdd={handleAddStage}
      />

      <EditStageModal
        stage={editingStage?.stage ?? null}
        onClose={() => setEditingStage(null)}
        onSave={handleSaveStage}
      />

      <AddTaskModal
        open={addTaskModal.open}
        onClose={() =>
          setAddTaskModal({ open: false, planId: null, stageId: null })
        }
        onAdd={handleAddTask}
      />

      <EditPlanTaskModal
        task={editingTask}
        onClose={() => {
          setEditingTask(null)
          setEditingTaskMeta(null)
        }}
        onSave={handleSaveTask}
      />
    </div>
  )
}

export default AdminPlansPage
