import { createBrowserRouter, Navigate } from 'react-router-dom'
import GuestRoute from './GuestRoute'
import ProtectedRoute from './ProtectedRoute'
import MainLayout from '@/components/layout/MainLayout'
import LoginPage from '@/pages/auth/LoginPage'
import RegisterPage from '@/pages/auth/RegisterPage'
import TodosPage from '@/pages/todos/TodosPage'

export const router = createBrowserRouter([
  // ─── Guest routes (chỉ truy cập khi chưa đăng nhập) ─────────────────────
  {
    element: <GuestRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },

  // ─── Protected routes (cần đăng nhập) ───────────────────────────────────
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <TodosPage /> },
        ],
      },
    ],
  },

  // ─── Fallback ────────────────────────────────────────────────────────────
  { path: '*', element: <Navigate to="/" replace /> },
])
