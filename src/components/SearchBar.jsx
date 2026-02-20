import { useState } from 'react'
import './SearchBar.css'

const SearchBar = ({ onSearch, onFilterByDifficulty }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    onSearch(term)
  }

  const handleDifficultyChange = (e) => {
    onFilterByDifficulty(e.target.value)
  }

  const handleClear = () => {
    setSearchTerm('')
    onSearch('')
  }

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="🔍 Search flashcards..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="search-input"
        />
        {searchTerm && (
          <button
            className="btn-clear"
            onClick={handleClear}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      <select
        className="difficulty-filter"
        onChange={handleDifficultyChange}
        title="Filter by difficulty"
      >
        <option value="all">All Levels</option>
        <option value="BEGINNER">Beginner</option>
        <option value="INTERMEDIATE">Intermediate</option>
        <option value="ADVANCED">Advanced</option>
      </select>
    </div>
  )
}

export default SearchBar
