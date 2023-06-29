import React from 'react'
import './SearchResults.css'
import TrackList from '../Tracklist/Tracklist'

class SearchResults extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { searchResults, error } = this.props

    let message = null
    if (searchResults.length === 0 && error === null) {
      message = 'Please search for some tracks on Spotify!'
    } else if (error !== null) {
      message = error
    }

    return (
      <div className="SearchResults">
        <h2>Results</h2>
        {message ? <div className="SearchResults-message">{message}</div> : <TrackList tracks={searchResults} buttonType="search" onAdd={this.props.onAdd} />}
      </div>
    )
  }
}

export default SearchResults
