import { createBrowserRouter, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'

import EmployeeLayout from '../layouts/EmployeeLayout'
import MentorLayout from '../layouts/MentorLayout'
import AdminLayout from '../layouts/AdminLayout'

import LoginPage from '../pages/auth/LoginPage'

import DashboardPage from '../pages/employee/DashboardPage'
import RoadmapPage from '../pages/employee/RoadmapPage'
import DirectoryPage from '../pages/employee/DirectoryPage'
import SurveyPage from '../pages/employee/SurveyPage'
import ProfilePage from '../pages/employee/ProfilePage'

import MentorDashboardPage from '../pages/mentor/MentorDashboardPage'
import MentorEmployeePage from '../pages/mentor/MentorEmployeePage'

import AdminDashboardPage from '../pages/admin/AdminDashboardPage'
import AdminEmployeesPage from '../pages/admin/AdminEmployeesPage'
import AdminPlansPage from '../pages/admin/AdminPlansPage'
import AdminSurveysPage from '../pages/admin/AdminSurveysPage'
import AdminSettingsPage from '../pages/admin/AdminSettingsPage'

const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },
  { path: '/', element: <Navigate to="/dashboard" replace /> },

  {
    path: '/',
    element: (
      <ProtectedRoute roles={['employee', 'mentor', 'admin']}>
        <EmployeeLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'roadmap', element: <RoadmapPage /> },
      { path: 'directory', element: <DirectoryPage /> },
      { path: 'survey', element: <SurveyPage /> },
      { path: 'profile', element: <ProfilePage /> },
    ],
  },

  {
    path: '/mentor',
    element: (
      <ProtectedRoute roles={['mentor', 'admin']}>
        <MentorLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <MentorDashboardPage /> },
      { path: ':userId', element: <MentorEmployeePage /> },
    ],
  },

  {
    path: '/admin',
    element: (
      <ProtectedRoute roles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <AdminDashboardPage /> },
      { path: 'employees', element: <AdminEmployeesPage /> },
      { path: 'plans', element: <AdminPlansPage /> },
      { path: 'surveys', element: <AdminSurveysPage /> },
      { path: 'settings', element: <AdminSettingsPage /> },
    ],
  },

  { path: '/403', element: <div>403 — Нет доступа</div> },
  { path: '*', element: <div>404 — Не найдено</div> },
])

export default router
