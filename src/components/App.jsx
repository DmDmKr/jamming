import SearchBar from './SearchBar'
import SearchResults from './SearchResults'
import Playlist from './Playlist'
import useAuth from '../hooks/useAuth'
import useSearch from '../hooks/useSearch'
import usePlaylist from '../hooks/usePlaylist'
import backgroundImage from '../assets/background_photo_desktop.jpg'
import { Box, Typography } from '@mui/material'

const App = () => {
  const { isAuthenticated, setIsAuthenticated } = useAuth()
  const {
    searchResults,
    isLoading: searchLoading,
    search,
    removeFromResults,
    addToResults,
    clearResults
  } = useSearch(setIsAuthenticated)
  const {
    playlistTracks,
    isLoading: playlistLoading,
    addTrack,
    removeTrack,
    savePlaylist,
    clearPlaylist
  } = usePlaylist(setIsAuthenticated)

  const handleAddTrack = track => {
    addTrack(track)
    removeFromResults(track.id)
  }

  const handleRemoveTrack = track => {
    removeTrack(track)
    addToResults(track)
  }

  const handleClearAll = () => {
    clearResults()
    clearPlaylist()
  }

  const isLoading = searchLoading || playlistLoading

  return (
    <Box
      component="main"
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
      <Typography variant="h1" component="h1" fontSize="4rem" color="white">
        Jamming
      </Typography>
      <SearchBar
        searchSpotify={search}
        handleClear={handleClearAll}
        isAuthenticated={isAuthenticated}
        isLoading={isLoading}
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
        <SearchResults searchResults={searchResults} onAdd={handleAddTrack} />
        <Playlist
          playlistTracks={playlistTracks}
          onRemove={handleRemoveTrack}
          onPlaylistSave={savePlaylist}
          isLoading={playlistLoading}
        />
      </Box>
    </Box>
  )
}

export default App
