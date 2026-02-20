export interface Todo {
  id: number
  title: string
  description: string | null
  priority: 1 | 2 | 3
  priority_label: 'low' | 'medium' | 'high'
  due_date: string | null
  is_completed: boolean
  completed_at: string | null
  is_overdue: boolean
  status: 'completed' | 'overdue' | 'due_today' | 'pending'
  category_id: number | null
  category?: {
    id: number
    name: string
  }
  created_at: string
  updated_at: string
}

export interface Category {
  id: number
  name: string
  color: string | null
  icon: string | null
  todos_count: number
  pending_count: number
  created_at: string
  updated_at: string
}

export interface PaginatedResponse<T> {
  data: T[]
  links: {
    first: string | null
    last: string | null
    prev: string | null
    next: string | null
  }
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number | null
    to: number | null
  }
}
