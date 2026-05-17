import { Typography } from 'antd'
import { moodLabel } from './types'

const { Text } = Typography

interface LineTooltipProps {
  active?: boolean
  payload?: { value: number }[]
  label?: number
}

const LineTooltip = ({ active, payload, label }: LineTooltipProps) => {
  if (!active || !payload?.length) return null
  const value = payload[0].value
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #f0f0f0',
        borderRadius: 8,
        padding: '10px 14px',
      }}
    >
      <Text style={{ fontSize: 15, color: '#999', display: 'block' }}>
        Неделя {label}
      </Text>
      <Text
        style={{
          fontSize: 17,
          fontWeight: 600,
          color: '#ff6720',
          display: 'block',
        }}
      >
        {value.toFixed(1)} — {moodLabel(value)}
      </Text>
    </div>
  )
}

export default LineTooltip
