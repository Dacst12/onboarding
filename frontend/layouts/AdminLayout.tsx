import {
  DashboardOutlined,
  FileTextOutlined,
  FormOutlined,
  SettingOutlined,
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
    key: '/admin/settings',
    icon: <SettingOutlined />,
    label: 'Настройки',
    path: '/admin/settings',
  },
]

const AdminLayout = () => <BaseLayout navItems={navItems} />

export default AdminLayout
