import { TeamOutlined, UserOutlined } from '@ant-design/icons'
import BaseLayout from './BaseLayout'

const navItems = [
  {
    key: '/mentor',
    icon: <TeamOutlined />,
    label: 'Подопечные',
    path: '/mentor',
  },
  {
    key: '/mentor/directory',
    icon: <TeamOutlined />,
    label: 'Команда',
    path: '/mentor/directory',
  },
  {
    key: '/mentor/profile',
    icon: <UserOutlined />,
    label: 'Профиль',
    path: '/mentor/profile',
  },
]

const MentorLayout = () => <BaseLayout navItems={navItems} />

export default MentorLayout
