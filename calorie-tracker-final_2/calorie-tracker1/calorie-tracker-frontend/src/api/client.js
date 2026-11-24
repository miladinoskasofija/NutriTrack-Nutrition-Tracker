import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8080/api',
})

// Автоматски го додава JWT токенот на секој повик (ако постои)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Ако токенот е невалиден/истечен, автоматски враќа на login
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
