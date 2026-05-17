import { useState } from 'react'
import { Layout, Menu, Avatar, Dropdown, Button } from 'antd'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
} from '@ant-design/icons'
import useAuthStore from '../store/authStore'

const { Header, Sider, Content } = Layout

interface NavItem {
  key: string
  icon: React.ReactNode
  label: string
  path: string
}

interface BaseLayoutProps {
  navItems: NavItem[]
}

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
                    {user?.full_name}
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
