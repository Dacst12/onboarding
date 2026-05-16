import { Card, Tag, Typography } from 'antd'
import { SolutionOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'

const { Text } = Typography

interface SurveyCardProps {
  filled: boolean
  weekNumber: number
  filledAt?: string
}

const SurveyCard = ({ filled, weekNumber, filledAt }: SurveyCardProps) => {
  const navigate = useNavigate()

  return (
    <Card
      style={{ borderRadius: 12, height: '100%' }}
      bodyStyle={{ padding: '20px 24px' }}
    >
      <Text
        style={{
          color: '#999',
          fontSize: 13,
          display: 'block',
          marginBottom: 14,
        }}
      >
        Еженедельный опрос
      </Text>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          width: '100%',
        }}
      >
        <div
          style={{
            width: 44,
            height: 44,
            background: '#fff3ee',
            borderRadius: 10,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <SolutionOutlined style={{ color: '#ff6720', fontSize: 20 }} />
        </div>

        <div style={{ flexShrink: 0, width: 150 }}>
          <Text strong style={{ fontSize: 15, display: 'block' }}>
            {filled ? 'Опрос заполнен' : 'Опрос не заполнен'}
          </Text>
          {filled ? (
            <Text
              style={{
                fontSize: 13,
                color: '#ff6720',
                display: 'block',
                marginTop: 5,
                cursor: 'pointer',
              }}
              onClick={() => navigate('/survey/history')}
            >
              Посмотреть историю
            </Text>
          ) : (
            <Tag
              style={{
                marginTop: 6,
                background: '#ff6720',
                border: 'none',
                color: '#fff',
                borderRadius: 6,
                fontSize: 13,
                cursor: 'pointer',
                padding: '2px 12px',
              }}
              onClick={() => navigate('/survey')}
            >
              Заполнить
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
          {filled
            ? 'Опрос за эту неделю уже заполнен — до следующей'
            : 'Расскажи как прошла неделя, всё ли понятно и есть ли вопросы'}
        </Text>

        <Text
          style={{
            fontSize: 14,
            fontWeight: 500,
            color: '#999',
            flexShrink: 0,
            whiteSpace: 'nowrap',
          }}
        >
          {filled
            ? `Неделя ${weekNumber} · ${filledAt}`
            : `Неделя ${weekNumber}`}
        </Text>
      </div>
    </Card>
  )
}

export default SurveyCard
