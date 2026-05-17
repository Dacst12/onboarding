import { useState } from 'react'
import { Card, Select, Row, Col, Typography } from 'antd'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { MoodPoint } from './types'
import { moodLabel } from './types'
import LineTooltip from './LineTooltip'

const { Text } = Typography

const departments = ['Разработка', 'Дизайн', 'Продукт', 'Инфраструктура', 'HR']

interface SurveysTabProps {
  moodData: Record<string, MoodPoint[]>
}

const SurveysTab = ({ moodData }: SurveysTabProps) => {
  const [department, setDepartment] = useState<string>('all')
  const data = moodData[department] ?? moodData['all']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <Row justify="end">
        <Col>
          <Select
            value={department}
            onChange={setDepartment}
            style={{ width: 200 }}
            size="large"
          >
            <Select.Option value="all">Все отделы</Select.Option>
            {departments.map((d) => (
              <Select.Option key={d} value={d}>
                {d}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>

      <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: '20px 24px' }}>
        <Text
          strong
          style={{ fontSize: 17, display: 'block', marginBottom: 4 }}
        >
          Среднее настроение по неделям
        </Text>
        <Text
          style={{
            fontSize: 15,
            color: '#bbb',
            display: 'block',
            marginBottom: 20,
          }}
        >
          Шкала от 1 (очень плохо) до 5 (отлично)
        </Text>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis
              dataKey="week"
              tickFormatter={(v) => `Неделя ${v}`}
              tick={{ fontSize: 15 }}
            />
            <YAxis
              domain={[1, 5]}
              ticks={[1, 2, 3, 4, 5]}
              tick={{ fontSize: 15 }}
            />
            <Tooltip content={<LineTooltip />} />
            <Line
              type="monotone"
              dataKey="avgMood"
              stroke="#ff6720"
              strokeWidth={2.5}
              dot={{ fill: '#ff6720', r: 5 }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      <Row gutter={12}>
        {data.map((d) => (
          <Col key={d.week} span={Math.floor(24 / data.length)}>
            <Card
              style={{ borderRadius: 10 }}
              bodyStyle={{ padding: '16px', textAlign: 'center' }}
            >
              <Text style={{ fontSize: 14, color: '#bbb', display: 'block' }}>
                Неделя {d.week}
              </Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  color: '#ff6720',
                  display: 'block',
                }}
              >
                {d.avgMood.toFixed(1)}
              </Text>
              <Text style={{ fontSize: 14, color: '#999' }}>
                {moodLabel(d.avgMood)}
              </Text>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

export default SurveysTab
