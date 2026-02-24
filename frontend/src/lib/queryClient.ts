import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Data is considered "fresh" for 30 seconds → don't refetch if not stale
      staleTime: 30_000,
      // Keep old data in cache for 5 minutes after component unmount
      gcTime: 5 * 60_000,
      // Don't auto-retry on 4xx errors (only retry network errors)
      retry: (failureCount, error: unknown) => {
        const status = (error as { response?: { status?: number } })?.response?.status
        if (status && status >= 400 && status < 500) return false
        return failureCount < 2
      },
      // Refetch when tab regains focus
      refetchOnWindowFocus: true,
    },
    mutations: {
      // Don't retry mutations (avoid double submit)
      retry: false,
    },
  },
})
