import {
  DashboardOutlined,
  FileTextOutlined,
  FormOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import BaseLayout from './BaseLayout'

const navItems = [
  {
    key: '/admin',
    icon: <DashboardOutlined />,
    label: 'Дашборд',
    path: '/admin',
  },
  {
    key: '/admin/plans',
    icon: <FileTextOutlined />,
    label: 'Планы',
    path: '/admin/plans',
  },
  {
    key: '/admin/surveys',
    icon: <FormOutlined />,
    label: 'Опросы',
    path: '/admin/surveys',
  },
  {
    key: '/admin/directory',
    icon: <TeamOutlined />,
    label: 'Команда',
    path: '/admin/directory',
  },
  {
    key: '/admin/profile',
    icon: <UserOutlined />,
    label: 'Профиль',
    path: '/admin/profile',
  },
]

const AdminLayout = () => <BaseLayout navItems={navItems} />

export default AdminLayout
