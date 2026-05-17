import axios from 'axios'
import { getToken, setToken } from '../utils/token'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

let isRefreshing = false
let failedQueue: Array<{
  resolve: (value: string) => void
  reject: (reason?: unknown) => void
}> = []

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token || '')
    }
  })
  failedQueue = []
}

api.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/login')) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return api(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      try {
        const response = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000'}/auth/refresh`,
          {},
          { withCredentials: true }
        )

        const newToken = response.data.access_token
        setToken(newToken)

        // Обновляем token в store
        const { user } = useAuthStore.getState()
        if (user) {
          useAuthStore.getState().setAuth(user, newToken)
        }

        originalRequest.headers.Authorization = `Bearer ${newToken}`
        processQueue(null, newToken)
        isRefreshing = false

        return api(originalRequest)
      } catch (err) {
        processQueue(err)
        isRefreshing = false
        localStorage.removeItem('auth-storage')
        window.location.href = '/login'
        return Promise.reject(err)
      }
    }

    return Promise.reject(error)
  }
)

export default api