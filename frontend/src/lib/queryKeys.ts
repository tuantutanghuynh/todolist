// ─── Query Keys ────────────────────────────────────────────────────────────────
// Centralize all query keys in one place.
// Benefit: when invalidating, just use the key defined here.
//
// Key structure using arrays:
//   ['todos']                    → all queries related to todos
//   ['todos', 'list', params]    → todo list with specific params
//   ['todos', 'stats']           → todo statistics
//   ['categories', 'list']       → categories list

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
