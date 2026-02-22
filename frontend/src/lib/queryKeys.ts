// ─── Query Keys ────────────────────────────────────────────────────────────────
// Tập trung tất cả query keys vào một chỗ.
// Lợi ích: khi cần invalidate, chỉ cần dùng key đã định nghĩa ở đây.
//
// Cách đặt key theo cấu trúc mảng:
//   ['todos']                    → tất cả queries liên quan đến todos
//   ['todos', 'list', params]    → danh sách todos với params cụ thể
//   ['todos', 'stats']           → thống kê todos
//   ['categories', 'list']       → danh sách categories

export const queryKeys = {
  todos: {
    all: ['todos'] as const,
    lists: () => ['todos', 'list'] as const,
    list: (params: object) => ['todos', 'list', params] as const,
    stats: () => ['todos', 'stats'] as const,
  },
  categories: {
    all: ['categories'] as const,
    list: () => ['categories', 'list'] as const,
  },
} as const
