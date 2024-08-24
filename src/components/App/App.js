import React, { useState } from 'react'
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'
import backgroundImage from '../../assets/background_photo_desktop.jpg'
import { Box, Typography } from '@mui/material'

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
    <Box
      sx={{
        height: '100%',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        textAlign: 'center',
        backgroundColor: '#535bcc',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'auto'
      }}
    >
      <Typography variant="h1" fontSize="4rem" color="white" sx={{ padding: '2rem 0' }}>
        Jamming
      </Typography>
      <SearchBar searchSpotify={searchSpotify} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          flex: 1, // Allow this box to grow and fill available space
          gap: '2rem',
          padding: '0 2rem'
        }}
      >
        <SearchResults searchResults={searchResults} onAdd={addTrack} error={error} />
        <Playlist
          playlistTracks={playlistTracks}
          onRemove={removeTrack}
          playlistName={playlistName}
          onNameChange={changePlaylistName}
          onPlaylistSave={savePlaylist}
        />
      </Box>
      {error && (
        <Typography className="error-message" sx={{ padding: '1rem', color: 'red' }}>
          {error}
        </Typography>
      )}
    </Box>
  )
}

export default App
