import axios from 'axios'

const API_URL = 'http://localhost:8080/api/flashcards'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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

export default api
