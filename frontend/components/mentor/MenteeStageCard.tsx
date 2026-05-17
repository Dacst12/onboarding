import { Card, Tag, Collapse, Checkbox, Typography, Button } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  LockOutlined,
  PlusOutlined,
  DeleteOutlined,
} from '@ant-design/icons'
import type { Stage } from '../roadmap/types'
import type { ModalTask } from '../ui/TaskModal'

const { Text } = Typography

const statusConfig = {
  done: {
    color: '#52c41a',
    bg: '#f6ffed',
    border: '#b7eb8f',
    icon: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    label: 'Завершён',
  },
  current: {
    color: '#ff6720',
    bg: '#fff3ee',
    border: '#ffd0b5',
    icon: <ClockCircleOutlined style={{ color: '#ff6720' }} />,
    label: 'В процессе',
  },
  locked: {
    color: '#bbb',
    bg: '#fafafa',
    border: '#f0f0f0',
    icon: <LockOutlined style={{ color: '#bbb' }} />,
    label: 'Не начат',
  },
}

interface MenteeStageCardProps {
  stage: Stage
  onTaskClick: (task: ModalTask) => void
  onTaskToggle?: (taskId: number, done: boolean) => void
  onAddTask?: (stageId: number) => void
  onDeleteTask?: (stageId: number, taskId: number) => void
}

const MenteeStageCard = ({
  stage,
  onTaskClick,
  onTaskToggle,
  onAddTask,
  onDeleteTask,
}: MenteeStageCardProps) => {
  const config = statusConfig[stage.status]
  const completedCount = stage.tasks.filter((t) => t.done).length

  return (
    <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 0 }}>
      <Collapse
        ghost
        className="roadmap-collapse"
        defaultActiveKey={stage.status === 'current' ? [stage.id] : []}
        items={[
          {
            key: stage.id,
            label: (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '4px 0',
                }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    background: config.bg,
                    border: `1px solid ${config.border}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {config.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                  >
                    <Text strong style={{ fontSize: 15 }}>
                      {stage.title}
                    </Text>
                    <Tag
                      style={{
                        background: config.bg,
                        border: `1px solid ${config.border}`,
                        color: config.color,
                        borderRadius: 6,
                        fontSize: 12,
                        margin: 0,
                      }}
                    >
                      {config.label}
                    </Tag>
                  </div>
                  <Text style={{ fontSize: 13, color: '#bbb' }}>
                    {completedCount}/{stage.tasks.length} задач выполнено
                  </Text>
                </div>
              </div>
            ),
            children: (
              <div style={{ padding: '0 12px 12px' }}>
                {stage.tasks.map((task, idx) => (
                  <div
                    key={task.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '10px',
                      borderRadius: 8,
                      background: idx % 2 === 0 ? '#fafafa' : '#fff',
                      marginBottom: 4,
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = '#f0f0f0')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background =
                        idx % 2 === 0 ? '#fafafa' : '#fff')
                    }
                    onClick={() =>
                      onTaskClick({
                        ...task,
                        description: task.description ?? '',
                      })
                    }
                  >
                    <div
                      style={{
                        transform: 'scale(1.4)',
                        transformOrigin: 'center',
                        flexShrink: 0,
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onTaskToggle?.(task.id, !task.done)
                      }}
                    >
                      <Checkbox
                        checked={task.done}
                        style={{ pointerEvents: 'none' }}
                      />
                    </div>

                    <div style={{ flexShrink: 0, width: 200 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: task.done ? '#bbb' : '#1a1a1a',
                          textDecoration: task.done ? 'line-through' : 'none',
                          display: 'block',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {task.title}
                      </Text>
                      {task.overdue && (
                        <Tag
                          style={{
                            background: '#fff1f0',
                            border: '1px solid #ffccc7',
                            color: '#ff4d4f',
                            borderRadius: 6,
                            fontSize: 11,
                            fontWeight: 600,
                            margin: '4px 0 0',
                          }}
                        >
                          ⚠ Просрочено
                        </Tag>
                      )}
                    </div>

                    <Text
                      style={{
                        fontSize: 13,
                        color: '#bbb',
                        flex: 1,
                        minWidth: 0,
                        overflow: 'hidden',
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {task.description}
                    </Text>

                    <Text
                      style={{
                        fontSize: 13,
                        color: task.overdue ? '#ff4d4f' : '#bbb',
                        flexShrink: 0,
                        fontWeight: 500,
                      }}
                    >
                      {task.due}
                    </Text>

                    {'isCustom' in task && Boolean(task.isCustom) && onDeleteTask && (
                      <Button
                        type="text"
                        icon={<DeleteOutlined />}
                        size="small"
                        danger
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteTask(stage.id, task.id)
                        }}
                      />
                    )}
                  </div>
                ))}

                {onAddTask && (
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
                    onClick={() => onAddTask(stage.id)}
                  >
                    Добавить задачу
                  </Button>
                )}
              </div>
            ),
          },
        ]}
      />
    </Card>
  )
}

export default MenteeStageCard
