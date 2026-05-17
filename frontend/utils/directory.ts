import type { CSSProperties } from 'react'

export const departmentColor: Record<string, string> = {
  HR: '#ff6720',
  Разработка: '#1677ff',
  Продукт: '#722ed1',
  Дизайн: '#eb2f96',
  Инфраструктура: '#52c41a',
  Product: '#722ed1',
}

export const getInitials = (name: string) =>
  name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

export const getDepartmentColor = (department: string) =>
  departmentColor[department] ?? '#ff6720'

export const getTagStyle = (department: string): CSSProperties => ({
  background: `${getDepartmentColor(department)}15`,
  border: `1px solid ${getDepartmentColor(department)}30`,
  color: getDepartmentColor(department),
  borderRadius: 6,
  fontSize: 13,
  margin: 0,
})
