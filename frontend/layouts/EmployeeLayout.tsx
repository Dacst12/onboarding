import {
  HomeOutlined,
  CompassOutlined,
  TeamOutlined,
  FormOutlined,
  UserOutlined,
} from '@ant-design/icons'
import BaseLayout from './BaseLayout'

const navItems = [
  {
    key: '/dashboard',
    icon: <HomeOutlined />,
    label: 'Главная',
    path: '/dashboard',
  },
  {
    key: '/roadmap',
    icon: <CompassOutlined />,
    label: 'Мой путь',
    path: '/roadmap',
  },
  {
    key: '/directory',
    icon: <TeamOutlined />,
    label: 'Команда',
    path: '/directory',
  },
  { key: '/survey', icon: <FormOutlined />, label: 'Опрос', path: '/survey' },
  {
    key: '/profile',
    icon: <UserOutlined />,
    label: 'Профиль',
    path: '/profile',
  },
]

const EmployeeLayout = () => <BaseLayout navItems={navItems} />

export default EmployeeLayout
