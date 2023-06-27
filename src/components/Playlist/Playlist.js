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

  handlePlaylistSave = (event) => {
    event.preventDefault()
    this.props.onPlaylistSave(this.props.playlistTracks)
  }

  render() {
    const { playlistName, playlistTracks } = this.props
    const isSaveDisabled = playlistTracks.length === 0

    return (
      <div className="Playlist">
        <div className="Playlist-name-input-container">
          <input placeholder={playlistName} onChange={this.handleNameChange} />
          <TrackList tracks={playlistTracks} buttonType="playlist" onRemove={this.props.onRemove} />
          <div className="Playlist-submit">
            <button onClick={this.handlePlaylistSave} disabled={isSaveDisabled}>
              Save to Spotify
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default Playlist
