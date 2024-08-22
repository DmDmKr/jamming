import React, { useState } from 'react'
import './App.css'
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'

const App = () => {
  const [searchResults, setSearchResults] = useState([])
  const [playlistName, setPlaylistName] = useState('New Playlist')
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [error, setError] = useState(null)

  const addTrack = track => {
    const isTrackInPlaylist = playlistTracks.some(playlistTrack => playlistTrack.id === track.id)

    if (!isTrackInPlaylist) {
      setPlaylistTracks(prevTracks => [...prevTracks, track])
      setSearchResults(prevResults =>
        prevResults.filter(playlistTrack => playlistTrack.id !== track.id)
      )
    }
  }

  const removeTrack = track => {
    setPlaylistTracks(prevTracks =>
      prevTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    )
    setSearchResults(prevResults => [track, ...prevResults])
  }

  const changePlaylistName = updatedPlaylistName => {
    setPlaylistName(updatedPlaylistName)
  }

  const savePlaylist = async () => {
    try {
      await Spotify.savePlaylist(playlistName, playlistTracks)
      setPlaylistName('')
      setPlaylistTracks([])
    } catch (error) {
      console.error('Error saving playlist:', error)
      setError('An error occurred while saving the playlist.')
    }
  }

  const searchSpotify = async term => {
    try {
      const tracks = await Spotify.search(term)
      if (tracks.length > 0) {
        setSearchResults(tracks)
        setError(null)
      } else {
        setSearchResults([])
        setError('No tracks found.')
      }
    } catch (error) {
      setSearchResults([])
      setError('An error occurred while fetching data.')
    }
  }

  return (
    <div className="App">
      <h1>Jamming</h1>
      <SearchBar searchSpotify={searchSpotify} />
      <div className="SongsListsContainer">
        <SearchResults searchResults={searchResults} onAdd={addTrack} error={error} />
        <Playlist
          playlistTracks={playlistTracks}
          onRemove={removeTrack}
          playlistName={playlistName}
          onNameChange={changePlaylistName}
          onPlaylistSave={savePlaylist}
        />
      </div>
      {error && <p className="error-message">{error}</p>}
    </div>
  )
}

export default App
