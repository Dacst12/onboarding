import { Card, Table, Tag, Progress, Avatar, Typography } from 'antd'
import { useNavigate } from 'react-router-dom'
import { getInitials, getDepartmentColor } from '../../utils/directory'
import { moodColor, moodLabel } from '../mentor/types'

const { Text } = Typography

export interface Employee {
  id: number
  name: string
  email?: string
  position: string
  department: string
  mentor: string
  plan: string
  completedTasks: number
  totalTasks: number
  lastMood: number | null
  startDate: string
  role: 'employee' | 'mentor' | 'admin'
}

const roleLabel: Record<string, string> = {
  employee: 'Сотрудник',
  mentor: 'Наставник',
  admin: 'Администратор',
}

const roleColor: Record<string, string> = {
  employee: '#1677ff',
  mentor: '#ff6720',
  admin: '#722ed1',
}

interface EmployeeTableProps {
  employees: Employee[]
}

const EmployeeTable = ({ employees }: EmployeeTableProps) => {
  const navigate = useNavigate()

  const columns = [
    {
      title: 'Сотрудник',
      key: 'employee',
      render: (_: unknown, record: Employee) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Avatar
            size={36}
            style={{
              background: getDepartmentColor(record.department),
              fontSize: 15,
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {getInitials(record.name)}
          </Avatar>
          <div>
            <Text strong style={{ fontSize: 16, display: 'block' }}>
              {record.name}
            </Text>
            <Text style={{ fontSize: 14, color: '#999' }}>
              {record.position}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Отдел',
      key: 'department',
      render: (_: unknown, record: Employee) => (
        <Tag
          style={{
            background: `${getDepartmentColor(record.department)}15`,
            border: `1px solid ${getDepartmentColor(record.department)}30`,
            color: getDepartmentColor(record.department),
            borderRadius: 6,
            fontSize: 14,
          }}
        >
          {record.department}
        </Tag>
      ),
    },
    {
      title: 'Роль',
      key: 'role',
      render: (_: unknown, record: Employee) => (
        <Tag
          style={{
            background: `${roleColor[record.role]}15`,
            border: `1px solid ${roleColor[record.role]}30`,
            color: roleColor[record.role],
            borderRadius: 6,
            fontSize: 14,
          }}
        >
          {roleLabel[record.role]}
        </Tag>
      ),
    },
    {
      title: 'Наставник',
      dataIndex: 'mentor',
      key: 'mentor',
      render: (mentor: string) => (
        <Text
          style={{ fontSize: 16, color: mentor === '—' ? '#bbb' : '#1a1a1a' }}
        >
          {mentor}
        </Text>
      ),
    },
    {
      title: 'План',
      dataIndex: 'plan',
      key: 'plan',
      render: (plan: string) => (
        <Text
          style={{ fontSize: 15, color: plan === '—' ? '#bbb' : '#1a1a1a' }}
        >
          {plan}
        </Text>
      ),
    },
    {
      title: 'Дата выхода',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string) => (
        <Text style={{ fontSize: 15, color: '#999' }}>{date}</Text>
      ),
    },
    {
      title: 'Прогресс',
      key: 'progress',
      render: (_: unknown, record: Employee) => {
        if (record.role !== 'employee')
          return <Text style={{ color: '#bbb', fontSize: 13 }}>—</Text>
        const percent = Math.round(
          (record.completedTasks / record.totalTasks) * 100
        )
        return (
          <div style={{ minWidth: 140 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: 4,
              }}
            >
              <Text style={{ fontSize: 14, color: '#999' }}>
                {record.completedTasks}/{record.totalTasks}
              </Text>
              <Text style={{ fontSize: 14, fontWeight: 600, color: '#ff6720' }}>
                {percent}%
              </Text>
            </div>
            <Progress
              percent={percent}
              strokeColor="#ff6720"
              trailColor="#ffe8dc"
              showInfo={false}
              size="small"
            />
          </div>
        )
      },
    },
    {
      title: 'Настроение',
      key: 'mood',
      render: (_: unknown, record: Employee) => {
        if (!record.lastMood)
          return <Text style={{ fontSize: 15, color: '#bbb' }}>—</Text>
        return (
          <Tag
            style={{
              background: `${moodColor[record.lastMood]}15`,
              border: `1px solid ${moodColor[record.lastMood]}30`,
              color: moodColor[record.lastMood],
              borderRadius: 6,
              fontSize: 14,
            }}
          >
            {moodLabel[record.lastMood]}
          </Tag>
        )
      },
    },
  ]

  return (
    <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 0 }}>
      <Table
        dataSource={employees}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 10, showSizeChanger: false }}
        onRow={(record) => ({
          onClick: () => navigate(`/admin/employees/${record.id}`),
          style: { cursor: 'pointer' },
          onMouseEnter: (e) => (e.currentTarget.style.background = '#fafafa'),
          onMouseLeave: (e) =>
            (e.currentTarget.style.background = 'transparent'),
        })}
      />
    </Card>
  )
}

export default EmployeeTable
