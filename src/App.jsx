import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { flashcardAPI } from './api'
import FlashcardList from './components/FlashcardList'
import FlashcardForm from './components/FlashcardForm'
import SearchBar from './components/SearchBar'
import Login from './components/Login'
import Register from './components/Register'
import { AuthProvider, useAuth } from './auth'
import './App.css'

// component that wraps protected content
function ProtectedRoute({ children }) {
  const auth = useAuth()
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

// main dashboard containing flashcards features
function Dashboard() {
  const [flashcards, setFlashcards] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [totalCount, setTotalCount] = useState(0)
  const auth = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    loadFlashcards()
    loadTotalCount()
  }, [])

  const loadFlashcards = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await flashcardAPI.getAll()
      setFlashcards(response.data)
    } catch (err) {
      setError('Failed to load flashcards. Make sure the API is running on http://localhost:8080')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const loadTotalCount = async () => {
    try {
      const response = await flashcardAPI.getTotal()
      const data = response.data
      const count = (data && typeof data === 'object')
        ? (data.total ?? data.count ?? 0)
        : Number(data) || 0
      setTotalCount(count)
    } catch (err) {
      console.error('Failed to load total count:', err)
    }
  }

  const handleAdd = async (formData) => {
    try {
      await flashcardAPI.create(formData)
      loadFlashcards()
      loadTotalCount()
      setError(null)
    } catch (err) {
      setError('Failed to create flashcard')
      console.error(err)
    }
  }

  const handleUpdate = async (formData) => {
    try {
      await flashcardAPI.update(editingId, formData)
      loadFlashcards()
      setEditingId(null)
      setError(null)
    } catch (err) {
      setError('Failed to update flashcard')
      console.error(err)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this flashcard?')) {
      try {
        await flashcardAPI.delete(id)
        loadFlashcards()
        loadTotalCount()
        setError(null)
      } catch (err) {
        setError('Failed to delete flashcard')
        console.error(err)
      }
    }
  }

  const handleSearch = async (keyword) => {
    setLoading(true)
    setError(null)
    try {
      if (keyword.trim()) {
        const response = await flashcardAPI.search(keyword)
        setFlashcards(response.data)
      } else {
        loadFlashcards()
      }
    } catch (err) {
      setError('Failed to search flashcards')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterByDifficulty = async (difficulty) => {
    setLoading(true)
    setError(null)
    try {
      if (difficulty === 'all') {
        loadFlashcards()
      } else {
        // Convert difficulty label to integer for API
        const difficultyMap = {
          'BEGINNER': 1,
          'INTERMEDIATE': 2,
          'ADVANCED': 3,
        }
        const response = await flashcardAPI.getByDifficulty(difficultyMap[difficulty])
        setFlashcards(response.data)
      }
    } catch (err) {
      setError('Failed to filter flashcards')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setEditingId(null)
  }

  const editingCard = editingId ? flashcards.find(card => card.id === editingId) : null

  const handleLogout = () => {
    auth.logout()
    navigate('/login')
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>📚 Flashcards API</h1>
        <p>Learn foreign language words with interactive flashcards</p>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>

      <div className="app-container">
        {error && <div className="error-message">{error}</div>}

        <div className="app-grid">
          <div className="form-section">
            <FlashcardForm
              onSubmit={editingId ? handleUpdate : handleAdd}
              initialData={editingCard}
              isEditing={!!editingId}
              onCancel={handleCancel}
            />
          </div>

          <div className="list-section">
            <div className="stats">
              <p>Total Flashcards: <strong>{totalCount}</strong></p>
            </div>

            <SearchBar onSearch={handleSearch} onFilterByDifficulty={handleFilterByDifficulty} />

            {loading ? (
              <div className="loading">Loading flashcards...</div>
            ) : (
              <FlashcardList
                flashcards={flashcards}
                onEdit={setEditingId}
                onDelete={handleDelete}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
