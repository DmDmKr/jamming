import React from 'react'
import './SearchBar.css'

class SearchBar extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="SearchBar">
        <div className="SearchBar-input-container">
          <input placeholder="Search Spotify" /*onChange={this.handleTermChange} onKeyDown={this.handleEnterKeyPress} value={this.state.term} className={this.state.termValid ? '' : 'error'}*/ />
          <div className="SearchBar-submit" /*onClick={this.handleSearch}*/>
            <a>Search</a>
          </div>
        </div>
      </div>
    )
  }
}

export default SearchBar
