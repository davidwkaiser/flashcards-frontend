import { useState } from 'react'
import FlashcardCard from './FlashcardCard'
import './FlashcardList.css'

const FlashcardList = ({ flashcards, onEdit, onDelete }) => {
  const [showEnglish, setShowEnglish] = useState(false)

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="empty-state">
        <p>📭 No flashcards found</p>
        <p className="hint">Create your first flashcard to get started!</p>
      </div>
    )
  }

  return (
    <div className="flashcard-list">
      <div className="list-header">
        <p className="list-title">Total: {flashcards.length} flashcards</p>
        <button
          className="toggle-button"
          onClick={() => setShowEnglish(!showEnglish)}
        >
          {showEnglish ? 'Show Foreign Language' : 'Show English'}
        </button>
      </div>
      <div className="cards-grid">
        {flashcards.map(card => (
          <FlashcardCard
            key={card.id}
            card={card}
            onEdit={onEdit}
            onDelete={onDelete}
            forceFlipped={showEnglish}
          />
        ))}
      </div>
    </div>
  )
}

export default FlashcardList
