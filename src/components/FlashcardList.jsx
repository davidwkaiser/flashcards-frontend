import FlashcardCard from './FlashcardCard'
import './FlashcardList.css'

const FlashcardList = ({ flashcards, onEdit, onDelete }) => {
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
      <p className="list-title">Total: {flashcards.length} flashcards</p>
      <div className="cards-grid">
        {flashcards.map(card => (
          <FlashcardCard
            key={card.id}
            card={card}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  )
}

export default FlashcardList
