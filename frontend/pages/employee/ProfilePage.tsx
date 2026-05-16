import { Typography } from 'antd'
import useAuthStore from '../../store/authStore'
import ProfileInfo from '../../components/profile/ProfileInfo'
import ProfileContacts from '../../components/profile/ProfileContacts'

const { Title } = Typography

const mockProfile = {
  name: 'Иван Петров',
  position: 'Frontend Developer',
  department: 'Разработка',
  team: 'Frontend',
  email: 'ivan@company.com',
  startDate: '5 мая 2025',
  mentor: 'Пётр Иванов',
  phone: '+79991234567',
  telegram: '@ivan_petrov',
  vk: 'vk.com/ivan_petrov',
}

const ProfilePage = () => {
  const { user } = useAuthStore()

  return (
    <div
      style={{
        maxWidth: 680,
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        Профиль
      </Title>

      <ProfileInfo
        name={user?.name ?? mockProfile.name}
        email={user?.email ?? mockProfile.email}
        position={mockProfile.position}
        department={mockProfile.department}
        team={mockProfile.team}
        startDate={mockProfile.startDate}
        mentor={mockProfile.mentor}
      />

      <ProfileContacts
        initial={{
          phone: mockProfile.phone,
          telegram: mockProfile.telegram,
          vk: mockProfile.vk,
        }}
      />
    </div>
  )
}

export default ProfilePage
