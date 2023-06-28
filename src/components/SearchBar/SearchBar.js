import React from 'react'
import './SearchBar.css'

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      term: ''
    }
  }

  handleTermChange = (event) => {
    const term = event.target.value
    this.setState({ term })
  }

  handleSearch = (event) => {
    const term = this.state.term.trim()
    if (term) {
      this.props.searchSpotify(term)
    }
    event.preventDefault()
  }

  handleEnterKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleSearch(event)
    }
  }

  render() {
    return (
      <div className="SearchBar">
        <div className="SearchBar-input-container">
          <input placeholder="Search Spotify" onChange={this.handleTermChange} onKeyDown={this.handleEnterKeyPress} value={this.state.term} />
          <div className="SearchBar-submit" onClick={this.handleSearch}>
            <button>Search</button>
          </div>
        </div>
      </div>
    )
  }
}

export default SearchBar
