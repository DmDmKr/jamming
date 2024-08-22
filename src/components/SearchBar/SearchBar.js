import React, { useState } from 'react'
import './SearchBar.css'

const SearchBar = ({ searchSpotify }) => {
  const [term, setTerm] = useState('')

  const handleTermChange = event => {
    setTerm(event.target.value)
  }

  const handleSearch = event => {
    event.preventDefault()
    const trimmedTerm = term.trim()
    if (trimmedTerm) {
      searchSpotify(trimmedTerm)
    }
  }

  const handleEnterKeyPress = event => {
    if (event.key === 'Enter') {
      handleSearch(event)
    }
  }

  return (
    <div className="SearchBar">
      <div className="SearchBar-input-container">
        <input
          placeholder="Search Spotify"
          onChange={handleTermChange}
          onKeyDown={handleEnterKeyPress}
          value={term}
        />
        <div className="SearchBar-submit" onClick={handleSearch}>
          <button>Search</button>
        </div>
      </div>
    </div>
  )
}

export default SearchBar
