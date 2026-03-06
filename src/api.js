import axios from 'axios'

// base URL for flashcard operations
const API_URL = 'http://localhost:8080/api/flashcards'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// if we ever get a 401 from the backend, remove stored token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token')
      // we can't navigate from here; calling code should handle by redirecting
    }
    return Promise.reject(error)
  }
)

export const flashcardAPI = {
  // Get all flashcards
  getAll: () => api.get(''),

  // Get flashcard by ID
  getById: (id) => api.get(`/${id}`),

  // Create flashcard
  create: (data) => api.post('', data),

  // Update flashcard
  update: (id, data) => api.put(`/${id}`, data),

  // Delete flashcard by ID
  delete: (id) => api.delete(`/${id}`),

  // Delete all flashcards
  deleteAll: () => api.delete('/'),

  // Get flashcards by language
  getByLanguage: (language) => api.get(`/language/${language}`),

  // Get flashcards by difficulty
  getByDifficulty: (difficulty) => api.get(`/difficulty/${difficulty}`),

  // Search flashcards
  search: (keyword) => api.get(`/search?keyword=${keyword}`),

  // Get total count
  getTotal: () => api.get('/stats/total'),
}

// auth endpoints live on a different base path
const AUTH_URL = 'http://localhost:8080/api/auth'

export const authAPI = {
  register: (credentials) => axios.post(`${AUTH_URL}/register`, credentials),
  login: (credentials) => axios.post(`${AUTH_URL}/login`, credentials),
}

export default api
