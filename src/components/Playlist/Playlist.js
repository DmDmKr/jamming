import React, { useState, useEffect } from 'react'
import './Playlist.css'
import TrackList from '../Tracklist/Tracklist'

const Playlist = (props) => {
  const [playlistName, setPlaylistName] = useState(props.playlistName)

  useEffect(() => {
    setPlaylistName(props.playlistName)
  }, [props.playlistName])

  const handleNameChange = (event) => {
    const updatedName = event.target.value.trim()
    setPlaylistName(updatedName)
    props.onNameChange(updatedName)
  }

  const handlePlaylistSave = async (event) => {
    event.preventDefault()
    try {
      await props.onPlaylistSave(props.playlistTracks)
      setPlaylistName('')
    } catch (error) {
      // Handle any error that occurred during saving the playlist
      console.error('Error saving playlist:', error)
      // Optionally, you can display an error message to the user
      // Handle the error state in the parent component (App) and display the error message
    }
  }

  const isSaveDisabled = props.playlistTracks.length === 0 || playlistName === ''

  return (
    <div className="Playlist">
      <div className="Playlist-name-input-container">
        <input placeholder={playlistName} value={playlistName} onChange={handleNameChange} />
        <TrackList tracks={props.playlistTracks} buttonType="playlist" onRemove={props.onRemove} />
        <div className="Playlist-submit">
          <button onClick={handlePlaylistSave} disabled={isSaveDisabled}>
            Save to Spotify
          </button>
        </div>
      </div>
    </div>
  )
}

export default Playlist
