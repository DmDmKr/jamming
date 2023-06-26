import React from 'react'
import './SearchResults.css'
import TrackList from '../Tracklist/Tracklist'

class SearchResults extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="SearchResults">
        <h2>Results</h2>
        <TrackList tracks={this.props.searchResults} buttonType="search" onAdd={this.props.onAdd} />
      </div>
    )
  }
}

export default SearchResults
