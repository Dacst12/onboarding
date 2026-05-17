import { Card, Button, Typography } from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  FileTextOutlined,
} from '@ant-design/icons'
import PlanStageList from './PlanStageList'
import type { Plan, PlanStage, PlanTask } from './types'

const { Text } = Typography

interface PlanCardProps {
  plan: Plan
  onEdit: (plan: Plan) => void
  onDelete: (planId: number) => void
  onAddStage: (planId: number) => void
  onEditStage: (planId: number, stage: PlanStage) => void
  onDeleteStage: (planId: number, stageId: number) => void
  onAddTask: (planId: number, stageId: number) => void
  onEditTask: (task: PlanTask, planId: number, stageId: number) => void
  onDeleteTask: (planId: number, stageId: number, taskId: number) => void
}

const PlanCard = ({
  plan,
  onEdit,
  onDelete,
  onAddStage,
  onEditStage,
  onDeleteStage,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: PlanCardProps) => (
  <Card
    style={{ borderRadius: 12 }}
    bodyStyle={{ padding: 0 }}
    title={
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 0',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: '#fff3ee',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FileTextOutlined style={{ color: '#ff6720', fontSize: 18 }} />
          </div>
          <div>
            <Text strong style={{ fontSize: 17, display: 'block' }}>
              {plan.name}
            </Text>
            <Text style={{ fontSize: 14, color: '#bbb' }}>{plan.roleType}</Text>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            type="text"
            icon={<EditOutlined />}
            style={{ color: '#ff6720' }}
            onClick={() => onEdit(plan)}
          >
            Изменить
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            danger
            onClick={() => onDelete(plan.id)}
          >
            Удалить
          </Button>
        </div>
      </div>
    }
  >
    <div style={{ padding: '0 16px 16px' }}>
      {plan.stages.length > 0 && (
        <PlanStageList
          planId={plan.id}
          stages={plan.stages}
          onEditStage={onEditStage}
          onDeleteStage={onDeleteStage}
          onAddTask={onAddTask}
          onEditTask={onEditTask}
          onDeleteTask={onDeleteTask}
        />
      )}
      <Button
        type="dashed"
        icon={<PlusOutlined />}
        block
        style={{ borderRadius: 8, color: '#ff6720', borderColor: '#ffd0b5' }}
        onClick={() => onAddStage(plan.id)}
      >
        Добавить этап
      </Button>
    </div>
  </Card>
)

export default PlanCard
