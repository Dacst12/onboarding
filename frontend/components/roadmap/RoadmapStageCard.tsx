import { Card, Tag, Collapse, Checkbox, Typography } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  LockOutlined,
} from '@ant-design/icons'
import { type Stage, type SelectedTask, statusConfig } from './types'

const { Text } = Typography

interface RoadmapStageCardProps {
  stage: Stage
  onTaskClick: (task: SelectedTask) => void
}

const RoadmapStageCard = ({ stage, onTaskClick }: RoadmapStageCardProps) => {
  const config = statusConfig[stage.status]
  const completedCount = stage.tasks.filter((t) => t.done).length

  const iconMap = {
    done: <CheckCircleOutlined style={{ color: '#52c41a' }} />,
    current: <ClockCircleOutlined style={{ color: '#ff6720' }} />,
    locked: <LockOutlined style={{ color: '#bbb' }} />,
  }

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
                  {iconMap[stage.status]}
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
                      padding: '10px 10px',
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
                        stageStatus: stage.status,
                      })
                    }
                  >
                    <div
                      style={{
                        flexShrink: 0,
                        transform: 'scale(1.3)',
                        transformOrigin: 'center',
                      }}
                      onClick={(e) => {
                        e.stopPropagation()
                        if (stage.status === 'locked') e.preventDefault()
                      }}
                    >
                      <Checkbox
                        checked={task.done}
                        disabled={stage.status === 'locked'}
                        style={{ pointerEvents: 'none' }}
                      />
                    </div>

                    <div style={{ flexShrink: 0, width: 200 }}>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: task.done
                            ? '#bbb'
                            : stage.status === 'locked'
                              ? '#bbb'
                              : '#1a1a1a',
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
                          Просрочено
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
                        display: 'block',
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
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {task.due}
                    </Text>
                  </div>
                ))}
              </div>
            ),
          },
        ]}
      />
    </Card>
  )
}

export default RoadmapStageCard
