import { useState, useMemo } from 'react'
import { Typography, Button, Modal, Spin, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import PlanCard from '../../components/admin/plans/PlanCard'
import AddPlanModal from '../../components/admin/plans/AddPlanModal'
import EditPlanModal from '../../components/admin/plans/EditPlanModal'
import AddStageModal from '../../components/admin/plans/AddStageModal'
import EditStageModal from '../../components/admin/plans/EditStageModal'
import AddTaskModal from '../../components/admin/plans/AddTaskModal'
import EditPlanTaskModal from '../../components/ui/EditPlanTaskModal'
import {
  useTemplatePlans,
  useCreateTemplatePlan,
  useUpdateTemplatePlan,
  useDeleteTemplatePlan,
  useAddTemplateStage,
  useUpdateTemplateStage,
  useDeleteTemplateStage,
  useAddTemplateTask,
  useUpdateTemplateTask,
  useDeleteTemplateTask,
} from '../../api/hooks/useAdmin'
import type { Plan, PlanStage } from '../../components/admin/plans/types'
import type { PlanTaskToEdit } from '../../components/ui/EditPlanTaskModal'

const { Title, Text } = Typography

const AdminPlansPage = () => {
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
  const [editingTask, setEditingTask] = useState<{
    stageId: number
    task: PlanTaskToEdit
  } | null>(null)

  const { data: templates = [], isLoading } = useTemplatePlans()
  const createMutation = useCreateTemplatePlan()
  const updateMutation = useUpdateTemplatePlan()
  const deleteMutation = useDeleteTemplatePlan()
  const addStageMutation = useAddTemplateStage()
  const updateStageMutation = useUpdateTemplateStage()
  const deleteStageMutation = useDeleteTemplateStage()
  const addTaskMutation = useAddTemplateTask()
  const updateTaskMutation = useUpdateTemplateTask()
  const deleteTaskMutation = useDeleteTemplateTask()

  const plans = useMemo(() => {
    return templates.map((template) => ({
      id: template.id,
      name: template.title,
      roleType: '',
      stages: template.stages.map((stage) => ({
        id: stage.id,
        title: stage.title,
        tasks: stage.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          description: task.description || '',
          offsetDay: task.offset_days,
        })),
      })),
    })) as Plan[]
  }, [templates])

  const handleAddPlan = async (values: { name: string; roleType: string }) => {
    try {
      await createMutation.mutateAsync({ title: values.name })
      setAddPlanModal(false)
    } catch {
      message.error('Ошибка при создании шаблона')
    }
  }

  const handleSavePlan = async (values: { name: string; roleType: string }) => {
    if (!editingPlan) return
    try {
      await updateMutation.mutateAsync({
        templateId: editingPlan.id,
        payload: { title: values.name },
      })
      setEditingPlan(null)
    } catch {
      message.error('Ошибка при обновлении шаблона')
    }
  }

  const handleDeletePlan = (planId: number) => {
    Modal.confirm({
      title: 'Удалить шаблон?',
      content: 'Шаблон будет удалён безвозвратно.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteMutation.mutateAsync(planId)
        } catch {
          message.error('Ошибка при удалении шаблона')
        }
      },
    })
  }

  const handleAddStage = async (title: string) => {
    if (!addStageModal.planId) return
    try {
      const plan = plans.find((p) => p.id === addStageModal.planId)
      const orderIndex = (plan?.stages.length ?? 0) + 1
      await addStageMutation.mutateAsync({
        templateId: addStageModal.planId,
        payload: { title, order_index: orderIndex },
      })
      setAddStageModal({ open: false, planId: null })
      message.success('Этап создан')
    } catch {
      message.error('Ошибка при создании этапа')
    }
  }

  const handleSaveStage = async (title: string) => {
    if (!editingStage) return
    try {
      await updateStageMutation.mutateAsync({
        templateId: editingStage.planId,
        stageId: editingStage.stage.id,
        payload: { title },
      })
      setEditingStage(null)
      message.success('Этап обновлен')
    } catch {
      message.error('Ошибка при обновлении этапа')
    }
  }

  const handleDeleteStage = async (planId: number, stageId: number) => {
    Modal.confirm({
      title: 'Удалить этап?',
      content: 'Этап и все его задачи будут удалены.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteStageMutation.mutateAsync({ templateId: planId, stageId })
          message.success('Этап удален')
        } catch {
          message.error('Ошибка при удалении этапа')
        }
      },
    })
  }

  const handleAddTask = async (values: {
    title: string
    description: string
    offsetDay: number
  }) => {
    if (!addTaskModal.stageId) return
    try {
      await addTaskMutation.mutateAsync({
        stageId: addTaskModal.stageId,
        payload: {
          title: values.title,
          description: values.description || undefined,
          offset_days: values.offsetDay,
        },
      })
      setAddTaskModal({ open: false, planId: null, stageId: null })
      message.success('Задача создана')
    } catch {
      message.error('Ошибка при создании задачи')
    }
  }

  const handleSaveTask = async (values: Partial<PlanTaskToEdit>) => {
    if (!editingTask) return
    try {
      await updateTaskMutation.mutateAsync({
        stageId: editingTask.stageId,
        taskId: editingTask.task.id,
        payload: {
          title: values.title,
          description: values.description,
          offset_days: values.offsetDay,
        },
      })
      setEditingTask(null)
      message.success('Задача обновлена')
    } catch {
      message.error('Ошибка при обновлении задачи')
    }
  }

  const handleDeleteTask = async (
    _planId: number,
    stageId: number,
    taskId: number
  ) => {
    Modal.confirm({
      title: 'Удалить задачу?',
      content: 'Задача будет удалена безвозвратно.',
      okText: 'Удалить',
      cancelText: 'Отмена',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await deleteTaskMutation.mutateAsync({ stageId, taskId })
          message.success('Задача удалена')
        } catch {
          message.error('Ошибка при удалении задачи')
        }
      },
    })
  }

  if (isLoading) {
    return <Spin />
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
          onEditTask={(task, _planId, stageId) => {
            setEditingTask({ stageId, task })
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
        task={editingTask?.task ?? null}
        onClose={() => {
          setEditingTask(null)
        }}
        onSave={handleSaveTask}
      />
    </div>
  )
}

export default AdminPlansPage
