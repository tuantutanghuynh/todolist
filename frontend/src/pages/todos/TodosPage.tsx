import { useAuth } from '@/contexts/AuthContext'

export default function TodosPage() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Todos Page</h1>
        <p className="mt-2 text-gray-600">Xin chào, {user?.name}</p>
        <button
          onClick={logout}
          className="mt-4 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Đăng xuất
        </button>
      </div>
    </div>
  )
}
