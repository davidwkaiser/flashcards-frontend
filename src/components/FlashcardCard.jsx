import { useState } from 'react'
import './FlashcardCard.css'

const FlashcardCard = ({ card, onEdit, onDelete }) => {
  const [isFlipped, setIsFlipped] = useState(false)

  const getDifficultyLabel = (difficulty) => {
    // Handle both integer and string formats
    if (typeof difficulty === 'number') {
      return {
        1: 'BEGINNER',
        2: 'INTERMEDIATE',
        3: 'ADVANCED',
      }[difficulty] || 'UNKNOWN'
    }
    return difficulty
  }

  const getDifficultyColor = (difficulty) => {
    const label = getDifficultyLabel(difficulty)
    switch (label) {
      case 'BEGINNER':
        return '#4CAF50'
      case 'INTERMEDIATE':
        return '#FF9800'
      case 'ADVANCED':
        return '#f44336'
      default:
        return '#2196F3'
    }
  }

  return (
    <div className="flashcard-card">
      <div
        className={`card-inner ${isFlipped ? 'flipped' : ''}`}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        <div className="card-front">
          <div className="card-content">
            <p className="card-label">Foreign Word</p>
            <p className="card-word">{card.foreignWord}</p>
          </div>
          <p className="flip-hint">Click to reveal</p>
        </div>
        <div className="card-back">
          <div className="card-content">
            <p className="card-label">English Translation</p>
            <p className="card-word">{card.englishTranslation}</p>
          </div>
          <p className="flip-hint">Click to go back</p>
        </div>
      </div>

      <div className="card-meta">
        <div className="meta-info">
          <span className="badge-language">{card.language}</span>
          <span
            className="badge-difficulty"
            style={{ backgroundColor: getDifficultyColor(card.difficulty) }}
          >
            {getDifficultyLabel(card.difficulty)}
          </span>
        </div>

        {card.exampleSentence && (
          <div className="example-sentence">
            <p className="example-label">Example:</p>
            <p className="example-text">{card.exampleSentence}</p>
          </div>
        )}
      </div>

      <div className="card-actions">
        <button
          className="btn-icon btn-edit"
          onClick={() => onEdit(card.id)}
          title="Edit flashcard"
        >
          ✏️ Edit
        </button>
        <button
          className="btn-icon btn-delete"
          onClick={() => onDelete(card.id)}
          title="Delete flashcard"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  )
}

export default FlashcardCard
