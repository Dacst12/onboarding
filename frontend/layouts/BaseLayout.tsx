import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Button, Badge, Typography } from 'antd'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
} from '@ant-design/icons'
import useAuthStore from '../store/authStore'

const { Header, Sider, Content } = Layout
const { Text } = Typography

interface NavItem {
  key: string
  icon: React.ReactNode
  label: string
  path: string
}

interface BaseLayoutProps {
  navItems: NavItem[]
}

const mockNotifications = [
  {
    id: 1,
    text: 'Заполни опрос за неделю 2',
    time: '10 мин назад',
    read: false,
  },
  {
    id: 2,
    text: 'Новая задача: Встреча с наставником',
    time: '1 час назад',
    read: false,
  },
  {
    id: 3,
    text: 'Этап 1 завершён — получен бейдж',
    time: '2 часа назад',
    read: true,
  },
]

const BaseLayout = ({ navItems }: BaseLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const handleMenuClick = ({ key }: { key: string }) => navigate(key)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const selectedKey =
    navItems.find((item) => location.pathname === item.path)?.key ?? ''

  const unreadCount = mockNotifications.filter((n) => !n.read).length

  const notificationDropdown = {
    items: [
      {
        key: 'header',
        label: (
          <div
            style={{ padding: '4px 0 8px', borderBottom: '1px solid #f0f0f0' }}
          >
            <Text strong style={{ fontSize: 16 }}>
              Уведомления
            </Text>
          </div>
        ),
        disabled: true,
      },
      ...mockNotifications.map((n) => ({
        key: String(n.id),
        label: (
          <div style={{ padding: '6px 0', maxWidth: 260 }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
              {!n.read && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: '#ff6720',
                    marginTop: 6,
                    flexShrink: 0,
                  }}
                />
              )}
              <div style={{ paddingLeft: n.read ? 14 : 0 }}>
                <div
                  style={{
                    fontSize: 15,
                    color: '#1a1a1a',
                    fontWeight: n.read ? 400 : 500,
                  }}
                >
                  {n.text}
                </div>
                <div style={{ fontSize: 13, color: '#bbb', marginTop: 2 }}>
                  {n.time}
                </div>
              </div>
            </div>
          </div>
        ),
      })),
    ],
  }

  const userDropdown = {
    items: [
      {
        key: 'logout',
        icon: <LogoutOutlined />,
        label: 'Выйти',
        danger: true,
        onClick: handleLogout,
      },
    ],
  }

  return (
    <Layout style={{ minHeight: '100vh', background: '#F9F9F9' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={220}
        style={{
          background: '#fff',
          borderRight: '1px solid #f0f0f0',
          boxShadow: '2px 0 12px rgba(0, 0, 0, 0.08)',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <Button
            type="text"
            icon={
              collapsed ? (
                <MenuUnfoldOutlined style={{ fontSize: 18 }} />
              ) : (
                <MenuFoldOutlined style={{ fontSize: 18 }} />
              )
            }
            onClick={() => setCollapsed(!collapsed)}
            style={{
              color: '#ff6720',
              margin: collapsed ? '0 auto' : '0 0 0 auto',
            }}
          />
        </div>

        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          items={navItems.map(({ key, icon, label }) => ({ key, icon, label }))}
          onClick={handleMenuClick}
          style={{ borderRight: 0, marginTop: 8, fontSize: 16 }}
        />

        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '16px',
            borderTop: '1px solid #f0f0f0',
            background: '#fff',
          }}
        >
          <Dropdown menu={userDropdown} placement="topLeft">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                borderRadius: 8,
                padding: '4px',
                transition: 'background 0.2s',
              }}
            >
              <Avatar
                size={32}
                icon={<UserOutlined />}
                src={user?.avatar}
                style={{ background: '#ff6720', flexShrink: 0 }}
              />
              {!collapsed && (
                <div style={{ overflow: 'hidden' }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 14,
                      color: '#1a1a1a',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {user?.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#999' }}>
                    {user?.department}
                  </div>
                </div>
              )}
            </div>
          </Dropdown>
        </div>
      </Sider>

      <Layout
        style={{
          marginLeft: collapsed ? 80 : 220,
          transition: 'margin-left 0.2s',
        }}
      >
        <Header
          style={{
            background: '#fff',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            borderBottom: '1px solid #f0f0f0',
            boxShadow: '0 2px 12px rgba(0, 0, 0, 0.06)',
            position: 'sticky',
            top: 0,
            zIndex: 99,
          }}
        >
          <Dropdown
            menu={notificationDropdown}
            placement="bottomRight"
            trigger={['click']}
          >
            <Badge count={unreadCount} size="small" color="#ff6720">
              <Button
                type="text"
                icon={<BellOutlined style={{ fontSize: 24 }} />}
                style={{ color: '#666' }}
              />
            </Badge>
          </Dropdown>
        </Header>

        <Content
          style={{
            margin: 24,
            padding: 24,
            background: '#fff',
            borderRadius: 12,
            minHeight: 'calc(100vh - 112px)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default BaseLayout
