import React from 'react'
import './Playlist.css'
import TrackList from '../Tracklist/Tracklist'

class Playlist extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="Playlist">
        <div className="Playlist-name-input-container">
          <input placeholder="Add playlist name" /*onChange={this.handleTermChange} onKeyDown={this.handleEnterKeyPress} value={this.state.term} className={this.state.termValid ? '' : 'error'}*/ />
          <TrackList tracks={this.props.playlistTracks} buttonType="playlist" onRemove={this.props.onRemove} />
          <div className="Playlist-submit" /*onClick={this.handleSave}*/>
            <a>Save to Spotify</a>
          </div>
        </div>
      </div>
    )
  }
}

export default Playlist
