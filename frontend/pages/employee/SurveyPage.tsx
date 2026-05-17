import { useState, useMemo } from 'react'
import {
  Card,
  Radio,
  Input,
  Button,
  Typography,
  Result,
  Spin,
  Alert,
} from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'
import { useMyPlan, useCreateFeedback, useLastFeedback } from '../../api/hooks/useEmployee'

const { Title, Text } = Typography
const { TextArea } = Input

interface SurveyForm {
  mood: number
  clarity: 'yes' | 'no' | 'partial' | null
  comment?: string
}

const moods = [
  { value: 1, emoji: '☹️', label: 'Очень плохо', color: '#ff4d4f' },
  { value: 2, emoji: '🙁', label: 'Плохо', color: '#ff7a45' },
  { value: 3, emoji: '😐', label: 'Нормально', color: '#faad14' },
  { value: 4, emoji: '🙂', label: 'Хорошо', color: '#52c41a' },
  { value: 5, emoji: '😄', label: 'Отлично', color: '#13c2c2' },
]

const SurveyPage = () => {
  const [form, setForm] = useState<SurveyForm>({
    mood: 0,
    clarity: null,
    comment: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { data: plan, isLoading: isPlanLoading } = useMyPlan()
  const { data: lastFeedback, isLoading: isFeedbackLoading } = useLastFeedback()
  const createFeedbackMutation = useCreateFeedback()

  const weekNumber = useMemo(() => {
    if (!plan) return 1
    const today = new Date()
    const startDate = new Date(plan.start_date)
    const daysPassed = Math.max(
      0,
      Math.floor(
        (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
      )
    )
    return Math.max(1, Math.floor(daysPassed / 7) + 1)
  }, [plan])

  const isSurveyFilledThisWeek = useMemo(() => {
    return (
      lastFeedback?.mood !== null &&
      lastFeedback?.mood !== undefined &&
      lastFeedback?.week_number === weekNumber
    )
  }, [lastFeedback, weekNumber])

  const update = <K extends keyof SurveyForm>(
    field: K,
    value: SurveyForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSubmit = form.mood > 0 && form.clarity !== null

  const handleSubmit = async () => {
    if (!canSubmit) return

    try {
      setError(null)
      await createFeedbackMutation.mutateAsync({
        week_number: weekNumber,
        mood: form.mood,
        tasks_clear: form.clarity !== 'no',
        wish: form.comment || undefined,
      })
      setSubmitted(true)
    } catch (err) {
      if (err instanceof Error) {
        setError('Ошибка при отправке опроса. Попробуй ещё раз')
      } else if (typeof err === 'object' && err !== null && 'response' in err) {
        const error = err as { response?: { status: number } }
        if (error.response?.status === 409) {
          setError('Опрос за эту неделю уже заполнен')
        } else {
          setError('Ошибка при отправке опроса. Попробуй ещё раз')
        }
      } else {
        setError('Ошибка при отправке опроса. Попробуй ещё раз')
      }
    }
  }

  if (isPlanLoading || isFeedbackLoading) {
    return <Spin />
  }

  if (isSurveyFilledThisWeek) {
    return (
      <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: '48px 32px' }}>
        <Result
          icon={
            <CheckCircleOutlined style={{ color: '#ff6720', fontSize: 64 }} />
          }
          title={
            <Title level={3} style={{ margin: 0 }}>
              Опрос уже заполнен
            </Title>
          }
          subTitle={
            <Text style={{ fontSize: 15, color: '#999' }}>
              Опрос за неделю {weekNumber} уже заполнен — спасибо за ответы!
            </Text>
          }
        />
      </Card>
    )
  }

  if (submitted) {
    return (
      <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: '48px 32px' }}>
        <Result
          icon={
            <CheckCircleOutlined style={{ color: '#ff6720', fontSize: 64 }} />
          }
          title={
            <Title level={3} style={{ margin: 0 }}>
              Спасибо за ответы!
            </Title>
          }
          subTitle={
            <Text style={{ fontSize: 15, color: '#999' }}>
              Твой фидбек за неделю {weekNumber} принят
            </Text>
          }
        />
      </Card>
    )
  }

  return (
    <div
      style={{
        maxWidth: 600,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      {/* Заголовок */}
      <div>
        <Title level={4} style={{ margin: '0 0 4px' }}>
          Как прошла неделя?
        </Title>
        <Text style={{ color: '#999', fontSize: 15 }}>
          Неделя {weekNumber} · займёт около минуты
        </Text>
      </div>

      {error && (
        <Alert
          type="error"
          message={error}
          showIcon
          style={{ borderRadius: 10 }}
          onClose={() => setError(null)}
          closable
        />
      )}

      <Card
        style={{ borderRadius: 12 }}
        bodyStyle={{
          padding: '28px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: 32,
        }}
      >
        {/* Вопрос 1 — Настроение */}
        <div>
          <Text
            strong
            style={{ fontSize: 16, display: 'block', marginBottom: 6 }}
          >
            Как твоё настроение на этой неделе?
          </Text>
          <Text
            style={{
              color: '#999',
              fontSize: 14,
              display: 'block',
              marginBottom: 16,
            }}
          >
            Оцени общее самочувствие и рабочий настрой
          </Text>
          <div style={{ display: 'flex', gap: 12 }}>
            {moods.map((mood) => (
              <div
                key={mood.value}
                onClick={() => update('mood', mood.value)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 6,
                  padding: '12px 8px',
                  borderRadius: 12,
                  cursor: 'pointer',
                  border: `2px solid ${form.mood === mood.value ? mood.color : '#f0f0f0'}`,
                  background:
                    form.mood === mood.value ? `${mood.color}12` : '#fafafa',
                  transition: 'all 0.15s',
                  flex: 1,
                }}
              >
                <span style={{ fontSize: 28 }}>{mood.emoji}</span>
                <Text
                  style={{
                    fontSize: 12,
                    color: form.mood === mood.value ? mood.color : '#bbb',
                    fontWeight: form.mood === mood.value ? 600 : 400,
                    textAlign: 'center',
                    lineHeight: 1.3,
                  }}
                >
                  {mood.label}
                </Text>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid #f5f5f5' }} />

        {/* Вопрос 2 — Ясность задач */}
        <div>
          <Text
            strong
            style={{ fontSize: 16, display: 'block', marginBottom: 6 }}
          >
            Понятны ли задачи на данный момент?
          </Text>
          <Text
            style={{
              color: '#999',
              fontSize: 14,
              display: 'block',
              marginBottom: 16,
            }}
          >
            Насколько ты понимаешь что нужно делать и как
          </Text>
          <Radio.Group
            value={form.clarity}
            onChange={(e) => update('clarity', e.target.value)}
            style={{ display: 'flex', gap: 12 }}
          >
            {[
              { value: 'yes', label: 'Да', color: '#52c41a' },
              { value: 'partial', label: 'Частично', color: '#faad14' },
              { value: 'no', label: 'Нет', color: '#ff4d4f' },
            ].map((opt) => (
              <Radio.Button
                key={opt.value}
                value={opt.value}
                style={{
                  borderRadius: 10,
                  border: `1.5px solid ${form.clarity === opt.value ? opt.color : '#f0f0f0'}`,
                  background:
                    form.clarity === opt.value ? `${opt.color}12` : '#fafafa',
                  color: form.clarity === opt.value ? opt.color : '#999',
                  fontWeight: form.clarity === opt.value ? 600 : 400,
                  fontSize: 15,
                  padding: '0 24px',
                  height: 44,
                  lineHeight: '42px',
                  transition: 'all 0.15s',
                }}
              >
                {opt.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>

        <div style={{ borderTop: '1px solid #f5f5f5' }} />

        {/* Вопрос 3 — Комментарий */}
        <div>
          <Text
            strong
            style={{ fontSize: 16, display: 'block', marginBottom: 6 }}
          >
            Добавьте пожелание
            <Text
              style={{
                fontSize: 13,
                color: '#bbb',
                fontWeight: 400,
                marginLeft: 8,
              }}
            >
              необязательно
            </Text>
          </Text>
          <Text
            style={{
              color: '#999',
              fontSize: 14,
              display: 'block',
              marginBottom: 16,
            }}
          >
            Что прошло хорошо? Что можно улучшить? Есть вопросы?
          </Text>
          <TextArea
            value={form.comment}
            onChange={(e) => update('comment', e.target.value)}
            placeholder="Напиши если хочешь поделиться чем-то ещё..."
            rows={4}
            style={{ borderRadius: 10, fontSize: 15 }}
          />
        </div>

        {/* Кнопка */}
        <Button
          type="primary"
          size="large"
          block
          disabled={!canSubmit || createFeedbackMutation.isPending}
          loading={createFeedbackMutation.isPending}
          onClick={handleSubmit}
          style={{
            borderRadius: 10,
            height: 48,
            fontSize: 16,
            fontWeight: 600,
            background: canSubmit ? '#ff6720' : undefined,
            border: 'none',
          }}
        >
          Отправить
        </Button>
      </Card>
    </div>
  )
}

export default SurveyPage
