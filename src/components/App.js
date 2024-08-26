import React from 'react'
import SearchBar from './SearchBar'
import SearchResults from './SearchResults'
import Playlist from './Playlist'
import useSpotify from '../hooks/useSpotify'
import backgroundImage from '../assets/background_photo_desktop.jpg'
import { Box, Typography } from '@mui/material'

const App = () => {
  const {
    searchResults,
    playlistTracks,
    playlistName,
    error,
    term,
    addTrack,
    setTerm,
    removeTrack,
    changePlaylistName,
    savePlaylist,
    searchSpotify,
    clearAll
  } = useSpotify()

  return (
    <Box
      gap={5}
      display="flex"
      height="100%"
      width="100%"
      minHeight="100vh"
      flexDirection="column"
      justifyContent="space-between"
      textAlign="center"
      backgroundColor="#535bcc"
      overflow="auto"
      sx={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <Typography variant="h1" fontSize="4rem" color="white">
        Jamming
      </Typography>
      <SearchBar
        term={term}
        setTerm={setTerm}
        searchSpotify={searchSpotify}
        handleClear={clearAll}
      />
      <Box
        display="grid"
        gridTemplateColumns="1fr 1fr"
        gap="2rem"
        padding="0 2rem"
        flex="1"
        alignItems="start"
        sx={{
          '@media (max-width: 600px)': {
            gridTemplateColumns: '1fr',
            padding: '0 1rem',
            gap: '1rem'
          }
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
