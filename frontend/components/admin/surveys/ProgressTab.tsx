import { Card, Table, Tag, Typography } from 'antd'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { ProgressData } from './types'
import { getDepartmentColor } from './types'
import BarTooltip from './BarTooltip'

const { Text } = Typography

const progressColumns = [
  {
    title: 'Отдел',
    dataIndex: 'department',
    key: 'department',
    render: (department: string) => (
      <Tag
        style={{
          background: `${getDepartmentColor(department)}15`,
          border: `1px solid ${getDepartmentColor(department)}30`,
          color: getDepartmentColor(department),
          borderRadius: 6,
          fontSize: 15,
          padding: '2px 10px',
        }}
      >
        {department}
      </Tag>
    ),
  },
  {
    title: 'Всего сотрудников',
    dataIndex: 'total',
    key: 'total',
    render: (v: number) => <Text style={{ fontSize: 16 }}>{v}</Text>,
  },
  {
    title: 'На адаптации',
    dataIndex: 'onboarding',
    key: 'onboarding',
    render: (v: number) => (
      <Tag
        style={{
          background: v > 0 ? '#fff3ee' : '#fafafa',
          border: `1px solid ${v > 0 ? '#ffd0b5' : '#f0f0f0'}`,
          color: v > 0 ? '#ff6720' : '#bbb',
          borderRadius: 6,
          fontSize: 15,
        }}
      >
        {v} чел.
      </Tag>
    ),
  },
  {
    title: 'Средний прогресс',
    dataIndex: 'avgPercent',
    key: 'avgPercent',
    render: (v: number) => (
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div
          style={{
            flex: 1,
            height: 6,
            borderRadius: 3,
            background: '#ffe8dc',
            minWidth: 100,
          }}
        >
          <div
            style={{
              width: `${v}%`,
              height: '100%',
              borderRadius: 3,
              background: '#ff6720',
            }}
          />
        </div>
        <Text
          style={{
            fontSize: 15,
            fontWeight: 600,
            color: '#ff6720',
            flexShrink: 0,
          }}
        >
          {v}%
        </Text>
      </div>
    ),
  },
]

interface ProgressTabProps {
  data: ProgressData[]
}

const ProgressTab = ({ data }: ProgressTabProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
    <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: '20px 24px' }}>
      <Text strong style={{ fontSize: 17, display: 'block', marginBottom: 20 }}>
        Средний прогресс по отделам
      </Text>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} barSize={36}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
          <XAxis dataKey="department" tick={{ fontSize: 15 }} />
          <YAxis tick={{ fontSize: 15 }} domain={[0, 100]} unit="%" />
          <Tooltip content={<BarTooltip />} />
          <Bar dataKey="avgPercent" fill="#ff6720" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </Card>

    <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: 0 }}>
      <Table
        dataSource={data}
        columns={progressColumns}
        rowKey="department"
        pagination={false}
      />
    </Card>
  </div>
)

export default ProgressTab
