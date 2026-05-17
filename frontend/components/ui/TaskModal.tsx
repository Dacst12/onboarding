import { Modal, Checkbox, Tag, Typography, Button } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined,
} from '@ant-design/icons'

const { Text } = Typography

export interface ModalTask {
  id: number
  title: string
  description: string
  due: string
  time?: string
  done: boolean
  overdue?: boolean
  priority?: string
}

interface TaskModalProps {
  task: ModalTask | null
  onClose: () => void
  onToggle?: () => void
  onEdit?: () => void
  disabled?: boolean
  disabledText?: string
}

const TaskModal = ({
  task,
  onClose,
  onToggle,
  onEdit,
  disabled,
  disabledText,
}: TaskModalProps) => (
  <Modal
    open={!!task}
    onCancel={onClose}
    footer={null}
    title={
      task && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {task.done ? (
            <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 18 }} />
          ) : task.overdue ? (
            <ClockCircleOutlined style={{ color: '#ff4d4f', fontSize: 18 }} />
          ) : (
            <ClockCircleOutlined style={{ color: '#ff6720', fontSize: 18 }} />
          )}

          <Text strong style={{ fontSize: 16 }}>
            {task.title}
          </Text>
        </div>
      )
    }
  >
    {task && (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          paddingTop: 8,
        }}
      >
        <Text style={{ fontSize: 14, color: '#555', lineHeight: 1.7 }}>
          {task.description}
        </Text>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {disabled ? (
            <Tag
              style={{
                background: '#fafafa',
                border: '1px solid #f0f0f0',
                color: '#bbb',
                borderRadius: 6,
                fontSize: 13,
                padding: '2px 10px',
              }}
            >
              Не начат
            </Tag>
          ) : task.overdue ? (
            <Tag
              style={{
                background: '#fff1f0',
                border: '1px solid #ffccc7',
                color: '#ff4d4f',
                borderRadius: 6,
                fontSize: 13,
                fontWeight: 600,
                padding: '2px 10px',
              }}
            >
              Просрочено
            </Tag>
          ) : task.done ? (
            <Tag
              style={{
                background: '#f6ffed',
                border: '1px solid #b7eb8f',
                color: '#52c41a',
                borderRadius: 6,
                fontSize: 13,
                padding: '2px 10px',
              }}
            >
              Выполнено
            </Tag>
          ) : (
            <Tag
              style={{
                background: '#fff3ee',
                border: '1px solid #ffd0b5',
                color: '#ff6720',
                borderRadius: 6,
                fontSize: 13,
                padding: '2px 10px',
              }}
            >
              В работе
            </Tag>
          )}
          <Text style={{ fontSize: 13, color: '#bbb' }}>
            {task.due}
            {task.time ? ` · ${task.time}` : ''}
          </Text>
        </div>

        {onToggle !== undefined && !disabled && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              borderRadius: 10,
              background: task.done ? '#f6ffed' : '#fafafa',
              cursor: 'pointer',
              border: `1px solid ${task.done ? '#b7eb8f' : '#f0f0f0'}`,
              transition: 'background 0.15s',
            }}
            onClick={onToggle}
          >
            <Checkbox checked={task.done} style={{ pointerEvents: 'none' }} />
            <Text
              style={{
                fontSize: 14,
                fontWeight: 500,
                color: task.done ? '#52c41a' : '#1a1a1a',
              }}
            >
              {task.done ? 'Задача выполнена' : 'Отметить как выполненную'}
            </Text>
          </div>
        )}

        {onEdit && (
          <Button
            block
            icon={<EditOutlined />}
            style={{ borderRadius: 8, marginTop: 4 }}
            onClick={onEdit}
          >
            Редактировать задачу
          </Button>
        )}

        {disabled && disabledText && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '12px 16px',
              borderRadius: 10,
              background: '#fafafa',
              border: '1px solid #f0f0f0',
            }}
          >
            <Text style={{ fontSize: 14, color: '#bbb' }}>{disabledText}</Text>
          </div>
        )}
      </div>
    )}
  </Modal>
)

export default TaskModal
