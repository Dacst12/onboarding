import { Form, Input, Button, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { login } from '../../api/auth'
import type { LoginCredentials } from '../../types/auth'
import useAuthStore from '../../store/authStore'

const { Title, Text } = Typography

const LoginPage = () => {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()

  const { mutate, isPending } = useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (data) => {
      setAuth(data.user, data.token)
      message.success('Добро пожаловать!')
      switch (data.user.role) {
        case 'admin':
          navigate('/admin')
          break
        case 'mentor':
          navigate('/mentor')
          break
        default:
          navigate('/dashboard')
      }
    },
    onError: () => {
      message.error('Неверный email или пароль')
    },
  })

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #FFF7F0 0%, #ffe8dc 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <div
        style={{
          position: 'fixed',
          top: -100,
          right: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.08)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'fixed',
          bottom: -150,
          left: -150,
          width: 500,
          height: 500,
          borderRadius: '50%',
          background: 'rgba(0, 0, 0, 0.05)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          width: '100%',
          maxWidth: 400,
          background: '#fff',
          borderRadius: 20,
          padding: '48px 40px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.12)',
          position: 'relative',

          zIndex: 1,
        }}
      >
        <div
          style={{
            marginBottom: 32,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Title
            level={3}
            style={{
              margin: '0 0 4px',
              color: '#1a1a1a',
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            Вход в систему
          </Title>
          <Text style={{ color: '#999', fontSize: 14 }}>
            Введите свои данные для входа
          </Text>
        </div>

        <Form
          layout="vertical"
          onFinish={(values: LoginCredentials) => mutate(values)}
          requiredMark={false}
          size="large"
          labelCol={{ style: { paddingBottom: 0 } }}
          style={{ display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          <Form.Item
            name="email"
            label={
              <Text strong style={{ fontSize: 14 }}>
                Email
              </Text>
            }
            rules={[
              { required: true, message: 'Введите email' },
              { type: 'email', message: 'Некорректный email' },
            ]}
            style={{ marginBottom: 0 }}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#ff6720' }} />}
              placeholder="you@company.com"
              style={{ borderRadius: 10, height: 44 }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={
              <Text strong style={{ fontSize: 14 }}>
                Пароль
              </Text>
            }
            rules={[{ required: true, message: 'Введите пароль' }]}
            style={{ marginBottom: 20 }}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#ff6720' }} />}
              placeholder="••••••••"
              style={{ borderRadius: 10, height: 44 }}
            />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              block
              style={{
                height: 48,
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                background: 'linear-gradient(135deg, #ff6720, #e55a1a)',
                border: 'none',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
              }}
            >
              Войти
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: 'center', marginTop: 24 }}>
          <Text style={{ color: '#bbb', fontSize: 13 }}>
            Нет аккаунта? Обратитесь к администратору
          </Text>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
