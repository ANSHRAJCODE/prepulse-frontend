import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// Request interceptor - inject JWT
api.interceptors.request.use((config) => {
  const auth = JSON.parse(localStorage.getItem('prepulse-auth') || '{}')
  const token = auth?.state?.token
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Response interceptor - handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('prepulse-auth')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api
