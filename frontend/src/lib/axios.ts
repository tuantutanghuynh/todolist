import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,   // gửi session cookie cross-origin (bắt buộc với Sanctum)
  withXSRFToken: true,     // tự đọc XSRF-TOKEN cookie và gửi kèm header X-XSRF-TOKEN
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // để Laravel nhận diện đây là AJAX request
  },
})

// ─── Request Interceptor ────────────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
)

// ─── Response Interceptor ───────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(error)
    }

    const { status } = error.response

    // 401: Để cho AuthContext và Router xử lý redirect
    // Không dùng window.location.href vì sẽ gây reload loop

    if (status === 419) {
      // CSRF token mismatch → thường xảy ra khi session hết hạn
      // Reload để lấy lại cookie mới
      window.location.reload()
    }

    return Promise.reject(error)
  },
)

// ─── Helper: lấy CSRF cookie trước khi login/register ───────────────────────
export const getCsrfCookie = () =>
  apiClient.get('/sanctum/csrf-cookie')

export default apiClient
