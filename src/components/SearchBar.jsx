import { useState } from 'react'
import './SearchBar.css'
import { LANGUAGES } from './constants'

const SearchBar = ({ onSearch, onFilterByDifficulty, onFilterByLanguage }) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSearchChange = (e) => {
    const term = e.target.value
    setSearchTerm(term)
    onSearch(term)
  }

  const handleDifficultyChange = (e) => {
    onFilterByDifficulty(e.target.value)
  }

  const handleLanguageChange = (e) => {
    onFilterByLanguage(e.target.value)
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

      <div className="filter-group">
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

        <select
          className="language-filter"
          onChange={handleLanguageChange}
          title="Filter by language"
        >
          <option value="all">All Languages</option>
          {LANGUAGES.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default SearchBar
