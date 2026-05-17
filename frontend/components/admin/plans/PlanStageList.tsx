import { Button, Collapse, List, Typography } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import PlanTaskItem from './PlanTaskItem'
import type { PlanStage, PlanTask } from './types'

const { Text } = Typography

interface PlanStageListProps {
  planId: number
  stages: PlanStage[]
  onEditStage: (planId: number, stage: PlanStage) => void
  onDeleteStage: (planId: number, stageId: number) => void
  onAddTask: (planId: number, stageId: number) => void
  onEditTask: (task: PlanTask, planId: number, stageId: number) => void
  onDeleteTask: (planId: number, stageId: number, taskId: number) => void
}

const PlanStageList = ({
  planId,
  stages,
  onEditStage,
  onDeleteStage,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: PlanStageListProps) => (
  <Collapse
    ghost
    className="roadmap-collapse"
    style={{ marginBottom: 12 }}
    items={stages.map((stage) => ({
      key: stage.id,
      label: (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Text strong style={{ fontSize: 16 }}>
            {stage.title}
          </Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Text style={{ fontSize: 14, color: '#bbb' }}>
              {stage.tasks.length} задач
            </Text>
            <Button
              type="text"
              icon={<EditOutlined />}
              size="small"
              style={{ color: '#ff6720' }}
              onClick={(e) => {
                e.stopPropagation()
                onEditStage(planId, stage)
              }}
            />
            <Button
              type="text"
              icon={<DeleteOutlined />}
              size="small"
              danger
              onClick={(e) => {
                e.stopPropagation()
                onDeleteStage(planId, stage.id)
              }}
            />
          </div>
        </div>
      ),
      children: (
        <div>
          <List
            dataSource={stage.tasks}
            renderItem={(task) => (
              <PlanTaskItem
                task={task}
                onEdit={(t) => onEditTask(t, planId, stage.id)}
                onDelete={(taskId) => onDeleteTask(planId, stage.id, taskId)}
              />
            )}
          />
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            block
            style={{
              marginTop: 8,
              borderRadius: 8,
              color: '#ff6720',
              borderColor: '#ffd0b5',
            }}
            onClick={() => onAddTask(planId, stage.id)}
          >
            Добавить задачу
          </Button>
        </div>
      ),
    }))}
  />
)

export default PlanStageList
