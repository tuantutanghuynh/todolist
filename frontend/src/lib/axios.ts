import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,   // send session cookie cross-origin (required for Sanctum)
  withXSRFToken: true,     // auto-read XSRF-TOKEN cookie and attach as X-XSRF-TOKEN header
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // so Laravel identifies this as an AJAX request
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

    // 401: Let AuthContext and Router handle the redirect
    // Don't use window.location.href as it would cause a reload loop

    if (status === 419) {
      // CSRF token mismatch → usually happens when session expires
      // Reload to get a fresh cookie
      window.location.reload()
    }

    return Promise.reject(error)
  },
)

// ─── Helper: fetch CSRF cookie before login/register ─────────────────────────
export const getCsrfCookie = () =>
  apiClient.get('/sanctum/csrf-cookie')

export default apiClient
