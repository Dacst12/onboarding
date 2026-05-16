import { useState } from 'react'
import { Card, Rate, Radio, Input, Button, Typography, Result } from 'antd'
import { CheckCircleOutlined } from '@ant-design/icons'

const { Title, Text } = Typography
const { TextArea } = Input

interface SurveyForm {
  mood: number
  clarity: 'yes' | 'no' | 'partial' | null
  comment?: string
}

const moodLabels: Record<number, { label: string; color: string }> = {
  1: { label: 'Очень плохо', color: '#ff4d4f' },
  2: { label: 'Плохо', color: '#ff7a45' },
  3: { label: 'Нормально', color: '#faad14' },
  4: { label: 'Хорошо', color: '#52c41a' },
  5: { label: 'Отлично', color: '#13c2c2' },
}

const SurveyPage = () => {
  const [form, setForm] = useState<SurveyForm>({
    mood: 0,
    clarity: null,
    comment: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const update = <K extends keyof SurveyForm>(
    field: K,
    value: SurveyForm[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const canSubmit = form.mood > 0 && form.clarity !== null

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
              Твой фидбек за неделю 2 принят
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
          Неделя 2 · займёт около минуты
        </Text>
      </div>

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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              gap: 10,
            }}
          >
            <Rate
              value={form.mood}
              onChange={(val) => update('mood', val)}
              style={{ fontSize: 32 }}
            />
            {form.mood > 0 && (
              <Text
                style={{
                  fontSize: 15,
                  color: moodLabels[form.mood].color,
                  fontWeight: 500,
                }}
              >
                {moodLabels[form.mood].label}
              </Text>
            )}
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

        {/* Вопрос 3 — Комментарий (опционально) */}
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
          disabled={!canSubmit}
          onClick={() => setSubmitted(true)}
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
