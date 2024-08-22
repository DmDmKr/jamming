import React from 'react'
import './SearchResults.css'
import TrackList from '../Tracklist/Tracklist'

const SearchResults = ({ searchResults, error, onAdd }) => {
  const getMessage = () => {
    if (error) {
      return error
    }
    if (searchResults.length === 0) {
      return 'Please search for some tracks on Spotify!'
    }
    return null
  }

  const message = getMessage()

  return (
    <div className="SearchResults">
      <h2>Results</h2>
      {message ? (
        <div className="SearchResults-message">{message}</div>
      ) : (
        <TrackList tracks={searchResults} buttonType="search" onAdd={onAdd} />
      )}
    </div>
  )
}

export default SearchResults
