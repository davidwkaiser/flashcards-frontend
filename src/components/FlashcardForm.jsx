import { useState, useEffect } from 'react'
import './FlashcardForm.css'

// Mapping between difficulty integers and display labels
const DIFFICULTY_MAP = {
  1: 'BEGINNER',
  2: 'INTERMEDIATE',
  3: 'ADVANCED',
}

const REVERSE_DIFFICULTY_MAP = {
  'BEGINNER': 1,
  'INTERMEDIATE': 2,
  'ADVANCED': 3,
}

const FlashcardForm = ({ onSubmit, initialData, isEditing, onCancel }) => {
  const [formData, setFormData] = useState({
    foreignWord: '',
    englishTranslation: '',
    language: 'Spanish',
    difficulty: 'INTERMEDIATE',
    exampleSentence: '',
  })

  useEffect(() => {
    if (initialData && isEditing) {
      // Convert difficulty integer from backend to text label for display
      const difficulty = initialData.difficulty
      const difficultyLabel = typeof difficulty === 'number' 
        ? DIFFICULTY_MAP[difficulty]
        : difficulty
      
      setFormData({
        ...initialData,
        difficulty: difficultyLabel || 'INTERMEDIATE',
      })
    } else {
      resetForm()
    }
  }, [initialData, isEditing])

  const resetForm = () => {
    setFormData({
      foreignWord: '',
      englishTranslation: '',
      language: 'Spanish',
      difficulty: 'INTERMEDIATE',
      exampleSentence: '',
    })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.foreignWord.trim() || !formData.englishTranslation.trim()) {
      alert('Please fill in the required fields')
      return
    }

    // Convert difficulty text to integer for backend
    const dataToSubmit = {
      ...formData,
      difficulty: REVERSE_DIFFICULTY_MAP[formData.difficulty],
    }

    onSubmit(dataToSubmit)
    if (!isEditing) {
      resetForm()
    }
  }

  return (
    <form className="flashcard-form" onSubmit={handleSubmit}>
      <h2>{isEditing ? '✏️ Edit Flashcard' : '➕ Add New Flashcard'}</h2>

      <div className="form-group">
        <label htmlFor="foreignWord">Foreign Word *</label>
        <input
          type="text"
          id="foreignWord"
          name="foreignWord"
          value={formData.foreignWord}
          onChange={handleChange}
          placeholder="e.g., 'hola'"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="englishTranslation">English Translation *</label>
        <input
          type="text"
          id="englishTranslation"
          name="englishTranslation"
          value={formData.englishTranslation}
          onChange={handleChange}
          placeholder="e.g., 'hello'"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="language">Language</label>
        <select
          id="language"
          name="language"
          value={formData.language}
          onChange={handleChange}
        >
          <option value="Spanish">Spanish</option>
          <option value="French">French</option>
          <option value="German">German</option>
          <option value="Italian">Italian</option>
          <option value="Portuguese">Portuguese</option>
          <option value="Japanese">Japanese</option>
          <option value="Chinese">Chinese</option>
          <option value="Korean">Korean</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="difficulty">Difficulty</label>
        <select
          id="difficulty"
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
        >
          <option value="BEGINNER">Beginner</option>
          <option value="INTERMEDIATE">Intermediate</option>
          <option value="ADVANCED">Advanced</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="exampleSentence">Example Sentence</label>
        <textarea
          id="exampleSentence"
          name="exampleSentence"
          value={formData.exampleSentence}
          onChange={handleChange}
          placeholder="Optional: Add an example sentence"
          rows={3}
        />
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {isEditing ? 'Update' : 'Add'} Flashcard
        </button>
        {isEditing && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}

export default FlashcardForm
