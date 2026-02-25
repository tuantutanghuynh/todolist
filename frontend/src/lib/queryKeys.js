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
    all: ['todos'],
    lists: () => ['todos', 'list'],
    list: (params) => ['todos', 'list', params],
    stats: () => ['todos', 'stats'],
  },
  categories: {
    all: ['categories'],
    list: () => ['categories', 'list'],
  },
}
