import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../api/axios'
import { isAxiosError } from 'axios'

export const useAuthInit = () => {
  const navigate = useNavigate()
  const { token, setAuth, logout } = useAuthStore()
  const initRef = useRef(false)

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true

    const initAuth = async () => {
      if (!token) {
        return
      }

      try {
        const response = await api.get('/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        setAuth(response.data, token)
      } catch (error: unknown) {
        if (isAxiosError(error) && error.response?.status === 401) {
          logout()
          navigate('/login')
        }
      }
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
