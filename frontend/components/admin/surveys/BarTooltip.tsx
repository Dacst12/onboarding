import { Typography } from 'antd'

const { Text } = Typography

interface BarTooltipProps {
  active?: boolean
  payload?: { value: number }[]
  label?: string
}

const BarTooltip = ({ active, payload, label }: BarTooltipProps) => {
  if (!active || !payload?.length) return null
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
        {label}
      </Text>
      <Text style={{ fontSize: 17, fontWeight: 600, color: '#ff6720' }}>
        {payload[0].value}%
      </Text>
    </div>
  )
}

export default BarTooltip
