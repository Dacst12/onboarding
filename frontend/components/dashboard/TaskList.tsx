import { useState } from 'react'
import { Card, List, Avatar, Badge, Tag, Typography } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ProfileOutlined,
  RightOutlined,
} from '@ant-design/icons'
import TaskModal, { type ModalTask } from '../ui/TaskModal'
import { useCompleteTask, useUncompleteTask } from '../../api/hooks/useEmployee'

const { Text } = Typography

export interface Task {
  id: number
  title: string
  description: string
  due: string
  time: string
  done: boolean
  priority: string
  overdue?: boolean
}

const priorityColor: Record<string, string> = {
  high: '#ff6720',
  medium: '#faad14',
  low: '#52c41a',
}

const priorityLabel: Record<string, string> = {
  high: 'Важно',
  medium: 'Средне',
  low: 'Низкий',
}

interface TaskListProps {
  tasks: Task[]
}

const TaskList = ({ tasks }: TaskListProps) => {
  const [selectedTask, setSelectedTask] = useState<ModalTask | null>(null)
  const completeTaskMutation = useCompleteTask()
  const uncompleteTaskMutation = useUncompleteTask()

  const handleToggleTask = async () => {
    if (!selectedTask) return

    try {
      if (selectedTask.done) {
        await uncompleteTaskMutation.mutateAsync(selectedTask.id)
      } else {
        await completeTaskMutation.mutateAsync(selectedTask.id)
      }
      setSelectedTask((prev) => (prev ? { ...prev, done: !prev.done } : null))
    } catch (error) {
      console.error('Ошибка при изменении статуса задачи:', error)
    }
  }

  return (
    <>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <ProfileOutlined style={{ color: '#ff6720' }} />
            <span style={{ fontWeight: 600 }}>Задачи</span>
            <Badge
              count={tasks.filter((t) => !t.done).length}
              style={{ background: '#ff6720' }}
            />
          </div>
        }
        style={{ borderRadius: 12 }}
      >
        <List
          dataSource={tasks}
          renderItem={(task) => (
            <List.Item
              style={{
                padding: '12px 8px',
                borderBottom: '1px solid #fafafa',
                opacity: task.done ? 0.45 : 1,
                cursor: 'pointer',
                borderRadius: 8,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = '#fafafa')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = 'transparent')
              }
              onClick={() => setSelectedTask(task)}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                }}
              >
                <Avatar
                  size={32}
                  style={{
                    background: task.done
                      ? '#f0f0f0'
                      : task.overdue
                        ? '#fff1f0'
                        : '#fff3ee',
                    flexShrink: 0,
                  }}
                  icon={
                    task.done ? (
                      <CheckCircleOutlined style={{ color: '#52c41a' }} />
                    ) : task.overdue ? (
                      <ClockCircleOutlined style={{ color: '#ff4d4f' }} />
                    ) : (
                      <ClockCircleOutlined style={{ color: '#ff6720' }} />
                    )
                  }
                />

                <div style={{ flexShrink: 0, width: 180 }}>
                  <Text
                    style={{
                      fontWeight: 500,
                      textDecoration: task.done ? 'line-through' : 'none',
                      color: task.done ? '#bbb' : '#1a1a1a',
                      fontSize: 15,
                      display: 'block',
                    }}
                  >
                    {task.title}
                  </Text>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      marginTop: 4,
                      flexWrap: 'wrap',
                    }}
                  >
                    {task.overdue ? (
                      <Tag
                        style={{
                          background: '#fff1f0',
                          border: '1px solid #ffccc7',
                          color: '#ff4d4f',
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          margin: 0,
                          lineHeight: '20px',
                          padding: '0 8px',
                        }}
                      >
                        Просрочено
                      </Tag>
                    ) : (
                      <Tag
                        style={{
                          background: `${priorityColor[task.priority]}18`,
                          border: `1.5px solid ${priorityColor[task.priority]}50`,
                          color: priorityColor[task.priority],
                          borderRadius: 6,
                          fontSize: 13,
                          fontWeight: 600,
                          margin: 0,
                          lineHeight: '20px',
                          padding: '0 8px',
                        }}
                      >
                        {priorityLabel[task.priority]}
                      </Tag>
                    )}
                  </div>
                </div>

                <Text
                  style={{
                    fontSize: 14,
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
                    fontSize: 14,
                    fontWeight: 500,
                    color: task.overdue ? '#ff4d4f' : '#999',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                  }}
                >
                  {task.due} · {task.time}
                </Text>

                <RightOutlined
                  style={{ color: '#ddd', fontSize: 12, flexShrink: 0 }}
                />
              </div>
            </List.Item>
          )}
        />
      </Card>

      <TaskModal
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onToggle={selectedTask ? handleToggleTask : undefined}
      />
    </>
  )
}

export default TaskList
