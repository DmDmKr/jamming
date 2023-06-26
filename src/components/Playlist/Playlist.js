import React from 'react'
import './Playlist.css'
import TrackList from '../Tracklist/Tracklist'

class Playlist extends React.Component {
  constructor(props) {
    super(props)
    this.handleNameChange = this.handleNameChange.bind(this)
  }

  handleNameChange(event) {
    const trimmedName = event.target.value.trim()
    this.props.onNameChange(trimmedName)
  }

  render() {
    return (
      <div className="Playlist">
        <div className="Playlist-name-input-container">
          <input placeholder={this.props.playlistName} onChange={this.handleNameChange} />
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
