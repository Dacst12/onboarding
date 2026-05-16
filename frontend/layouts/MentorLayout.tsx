import {
  TeamOutlined,
  CompassOutlined,
  FormOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons'
import BaseLayout from './BaseLayout'

const navItems = [
  { key: '/mentor', icon: <TeamOutlined />, label: 'Подопечные', path: '/mentor' },
  { key: '/roadmap', icon: <CompassOutlined />, label: 'Мой путь', path: '/roadmap' },
  { key: '/directory', icon: <TeamOutlined />, label: 'Команда', path: '/directory' },
  { key: '/survey', icon: <FormOutlined />, label: 'Опрос', path: '/survey' },
  { key: '/achievements', icon: <TrophyOutlined />, label: 'Достижения', path: '/achievements' },
  { key: '/profile', icon: <UserOutlined />, label: 'Профиль', path: '/profile' },
]

const MentorLayout = () => <BaseLayout navItems={navItems} />

export default MentorLayout