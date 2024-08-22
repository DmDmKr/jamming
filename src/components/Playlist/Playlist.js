import React, { useState, useEffect } from 'react'
import './Playlist.css'
import TrackList from '../Tracklist/Tracklist'

const Playlist = ({
  playlistName: initialPlaylistName,
  playlistTracks,
  onNameChange,
  onRemove,
  onPlaylistSave
}) => {
  const [playlistName, setPlaylistName] = useState(initialPlaylistName)

  useEffect(() => {
    setPlaylistName(initialPlaylistName)
  }, [initialPlaylistName])

  const handleNameChange = event => {
    const updatedName = event.target.value
    setPlaylistName(updatedName)
    onNameChange(updatedName)
  }

  const handlePlaylistSave = async event => {
    event.preventDefault()
    try {
      await onPlaylistSave(playlistTracks)
      setPlaylistName('') // Clear the name after saving
    } catch (error) {
      console.error('Error saving playlist:', error)
      // Optionally, display an error message to the user
    }
  }

  const isSaveDisabled = playlistTracks.length === 0 || playlistName === ''

  return (
    <div>
      <div className="Playlist">
        <div className="Playlist-name-input-container">
          <input
            placeholder="Enter playlist name"
            value={playlistName}
            onChange={handleNameChange}
          />
          <TrackList tracks={playlistTracks} buttonType="playlist" onRemove={onRemove} />
        </div>
      </div>
      <div className="Playlist-submit">
        <button onClick={handlePlaylistSave} disabled={isSaveDisabled}>
          Save to Spotify
        </button>
      </div>
    </div>
  )
}

export default Playlist
