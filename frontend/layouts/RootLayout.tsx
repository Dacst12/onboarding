import { Outlet } from 'react-router-dom'
import { useAuthInit } from '../hooks/useAuthInit'

export const RootLayout = () => {
  useAuthInit()
  return <Outlet />
}

export default RootLayout
