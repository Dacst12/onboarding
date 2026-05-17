import { Button, Typography, List } from 'antd'
import {
  EditOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons'
import type { PlanTask } from './types'

const { Text } = Typography

interface PlanTaskItemProps {
  task: PlanTask
  onEdit: (task: PlanTask) => void
  onDelete: (taskId: number) => void
}

const PlanTaskItem = ({ task, onEdit, onDelete }: PlanTaskItemProps) => (
  <List.Item style={{ padding: '8px 12px', borderBottom: '1px solid #fafafa' }}>
    <div
      style={{ display: 'flex', alignItems: 'center', gap: 10, width: '100%' }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text style={{ fontSize: 16, fontWeight: 500, display: 'block' }}>
          {task.title}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: '#bbb',
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            display: 'block',
          }}
        >
          {task.description}
        </Text>
      </div>
      <div
        style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}
      >
        <ClockCircleOutlined style={{ color: '#bbb', fontSize: 14 }} />
        <Text style={{ fontSize: 14, color: '#bbb' }}>
          На {task.offsetDay}-й день
        </Text>
      </div>
      <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
        <Button
          type="text"
          icon={<EditOutlined />}
          size="small"
          style={{ color: '#ff6720' }}
          onClick={() => onEdit(task)}
        />
        <Button
          type="text"
          icon={<DeleteOutlined />}
          size="small"
          danger
          onClick={() => onDelete(task.id)}
        />
      </div>
    </div>
  </List.Item>
)

export default PlanTaskItem
