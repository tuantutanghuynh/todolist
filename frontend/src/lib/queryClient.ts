import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dữ liệu coi là "tươi" trong 30 giây → không refetch nếu chưa stale
      staleTime: 30_000,
      // Giữ dữ liệu cũ trong cache 5 phút sau khi component unmount
      gcTime: 5 * 60_000,
      // Không tự retry khi lỗi 4xx (chỉ retry lỗi mạng)
      retry: (failureCount, error: unknown) => {
        const status = (error as { response?: { status?: number } })?.response?.status
        if (status && status >= 400 && status < 500) return false
        return failureCount < 2
      },
      // Refetch khi tab được focus lại
      refetchOnWindowFocus: true,
    },
    mutations: {
      // Không retry mutation (tránh double submit)
      retry: false,
    },
  },
})
