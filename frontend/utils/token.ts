export const getToken = (): string | null => {
  return localStorage.getItem('auth-storage')
    ? JSON.parse(localStorage.getItem('auth-storage')!).state.token
    : null
}

export const setToken = (token: string): void => {
  const stored = localStorage.getItem('auth-storage')
  if (stored) {
    const data = JSON.parse(stored)
    data.state.token = token
    localStorage.setItem('auth-storage', JSON.stringify(data))
  }
}