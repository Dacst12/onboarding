import { Card, Form, Select, Switch, Button, Typography, message } from 'antd'
import { useState } from 'react'

const { Text } = Typography

const SurveySettingsTab = () => {
  const [form] = Form.useForm()
  const [enabled, setEnabled] = useState(true)

  const handleSave = () => {
    message.success('Настройки сохранены')
  }

  return (
    <div
      style={{
        maxWidth: 520,
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
      }}
    >
      <Card style={{ borderRadius: 12 }} bodyStyle={{ padding: '20px 24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div>
            <Text strong style={{ fontSize: 17, display: 'block' }}>
              Еженедельные опросы
            </Text>
            <Text style={{ fontSize: 15, color: '#bbb' }}>
              Сотрудники будут получать опрос по расписанию
            </Text>
          </div>
          <Switch
            checked={enabled}
            onChange={setEnabled}
            style={{ background: enabled ? '#ff6720' : undefined }}
          />
        </div>

        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          initialValues={{ day: 'friday', frequency: 'weekly' }}
          disabled={!enabled}
        >
          <Form.Item name="frequency" label="Частота">
            <Select size="large">
              <Select.Option value="weekly">Каждую неделю</Select.Option>
              <Select.Option value="biweekly">Раз в две недели</Select.Option>
              <Select.Option value="monthly">Раз в месяц</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="day" label="День недели" style={{ marginBottom: 0 }}>
            <Select size="large">
              <Select.Option value="monday">Понедельник</Select.Option>
              <Select.Option value="tuesday">Вторник</Select.Option>
              <Select.Option value="wednesday">Среда</Select.Option>
              <Select.Option value="thursday">Четверг</Select.Option>
              <Select.Option value="friday">Пятница</Select.Option>
              <Select.Option value="saturday">Суббота</Select.Option>
              <Select.Option value="sunday">Воскресенье</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Card>

      <Button
        type="primary"
        size="large"
        style={{
          background: enabled ? '#ff6720' : '#f0f0f0',
          border: 'none',
          borderRadius: 10,
          alignSelf: 'flex-start',
          color: enabled ? '#fff' : '#bbb',
          cursor: enabled ? 'pointer' : 'not-allowed',
          boxShadow: 'none',
        }}
        onClick={enabled ? handleSave : undefined}
      >
        Сохранить
      </Button>
    </div>
  )
}

export default SurveySettingsTab
