import { useState } from 'react'
import { List, Tag, Typography, Checkbox, message, Modal, Button } from 'antd'
import { CheckCircleOutlined, ClockCircleOutlined, DeleteOutlined } from '@ant-design/icons'
import TaskModal from '../ui/TaskModal'
import EditTaskModal from '../ui/EditTaskModal'
import type { ModalTask } from '../ui/TaskModal'

const { Text } = Typography

export interface AdminTask {
  id: number
  title: string
  description: string
  stage: string
  done: boolean
  due: string
  dueDate?: string
  overdue: boolean
  isSystemTask?: boolean
}

interface EmployeeTaskListProps {
  tasks: AdminTask[]
  onTasksChange: (tasks: AdminTask[]) => void
  onDeleteTask?: (taskId: number) => void
}

const EmployeeTaskList = ({ tasks, onTasksChange, onDeleteTask }: EmployeeTaskListProps) => {
  const [selectedTask, setSelectedTask] = useState<ModalTask | null>(null)
  const [editingTask, setEditingTask] = useState<AdminTask | null>(null)

  const sortedTasks = [...tasks].sort((a, b) => {
    const dateA = a.dueDate || a.due
    const dateB = b.dueDate || b.due
    if (!dateA || !dateB) return 0
    return new Date(dateA).getTime() - new Date(dateB).getTime()
  })

  const handleToggleInline = (taskId: number) => {
    onTasksChange(
      tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t))
    )
  }

  const handleToggleModal = () => {
    if (!selectedTask) return
    onTasksChange(
      tasks.map((t) => (t.id === selectedTask.id ? { ...t, done: !t.done } : t))
    )
    setSelectedTask((prev) => (prev ? { ...prev, done: !prev.done } : null))
  }

  const handleSaveEdit = (values: Partial<AdminTask>) => {
    onTasksChange(
      tasks.map((t) => (t.id === editingTask?.id ? { ...t, ...values } : t))
    )
    message.success('Задача обновлена')
  }

  return (
    <>
      <List
        dataSource={sortedTasks}
        renderItem={(task) => (
          <List.Item
            style={{
              padding: '12px 8px',
              borderBottom: '1px solid #fafafa',
              cursor: 'pointer',
              borderRadius: 8,
              transition: 'background 0.15s',
              opacity: task.done ? 0.6 : 1,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#fafafa')}
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = 'transparent')
            }
            onClick={() =>
              setSelectedTask({
                id: task.id,
                title: task.title,
                description: task.description,
                due: task.due,
                done: task.done,
                overdue: task.overdue,
              })
            }
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                width: '100%',
              }}
            >
              <div
                style={{
                  transform: 'scale(1.3)',
                  transformOrigin: 'center',
                  flexShrink: 0,
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleToggleInline(task.id)
                }}
              >
                <Checkbox
                  checked={task.done}
                  style={{ pointerEvents: 'none' }}
                />
              </div>

              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: task.done
                    ? '#f6ffed'
                    : task.overdue
                      ? '#fff1f0'
                      : '#fff3ee',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                {task.done ? (
                  <CheckCircleOutlined
                    style={{ color: '#52c41a', fontSize: 14 }}
                  />
                ) : (
                  <ClockCircleOutlined
                    style={{
                      color: task.overdue ? '#ff4d4f' : '#ff6720',
                      fontSize: 16,
                    }}
                  />
                )}
              </div>

              <div style={{ flexShrink: 0, width: 180 }}>
                <Text
                  style={{
                    fontSize: 16,
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
                <Text style={{ fontSize: 14, color: '#bbb' }}>
                  {task.stage}
                </Text>
              </div>

              <Text
                style={{
                  fontSize: 15,
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

              {task.overdue && (
                <Tag
                  style={{
                    background: '#fff1f0',
                    border: '1px solid #ffccc7',
                    color: '#ff4d4f',
                    borderRadius: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  Просрочено
                </Tag>
              )}

              <Text
                style={{
                  fontSize: 15,
                  color: task.overdue ? '#ff4d4f' : '#bbb',
                  flexShrink: 0,
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                }}
              >
                {task.due}
              </Text>

              {!task.isSystemTask && onDeleteTask && (
                <Button
                  type="text"
                  danger
                  size="small"
                  icon={<DeleteOutlined />}
                  onClick={(e) => {
                    e.stopPropagation()
                    Modal.confirm({
                      title: 'Удалить задачу?',
                      content: 'Задача будет удалена безвозвратно.',
                      okText: 'Удалить',
                      cancelText: 'Отмена',
                      okButtonProps: { danger: true },
                      onOk: () => {
                        onDeleteTask(task.id)
                      },
                    })
                  }}
                  style={{ flexShrink: 0 }}
                />
              )}
            </div>
          </List.Item>
        )}
      />

      <TaskModal
        task={
          selectedTask
            ? {
                ...selectedTask,
                isSystemTask: tasks.find((t) => t.id === selectedTask.id)
                  ?.isSystemTask,
              }
            : null
        }
        onClose={() => setSelectedTask(null)}
        onToggle={handleToggleModal}
        onEdit={() => {
          const task = tasks.find((t) => t.id === selectedTask?.id)
          if (task) {
            setEditingTask(task)
            setSelectedTask(null)
          }
        }}
        onDelete={
          selectedTask
            ? () => {
                onDeleteTask?.(selectedTask.id)
                setSelectedTask(null)
              }
            : undefined
        }
      />

      <EditTaskModal
        task={editingTask}
        onClose={() => setEditingTask(null)}
        onSave={handleSaveEdit}
      />
    </>
  )
}

export default EmployeeTaskList
