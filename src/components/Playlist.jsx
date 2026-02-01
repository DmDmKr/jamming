import { useState } from 'react'
import { Box, TextField, Button, useTheme } from '@mui/material'
import TrackList from './Tracklist'

const Playlist = ({ playlistTracks, onRemove, onPlaylistSave }) => {
  const [playlistName, setPlaylistName] = useState('New Playlist')
  const theme = useTheme()

  const handleNameChange = event => {
    setPlaylistName(event.target.value)
  }

  const handlePlaylistSave = async event => {
    event.preventDefault()

    const success = await onPlaylistSave(playlistName)

    if (success) {
      setPlaylistName('New Playlist')
    }
  }

  const isSaveDisabled = playlistTracks.length === 0 || !playlistName.trim()

  return (
    <Box display="flex" flexDirection="column" gap={5} color="aliceblue" height="100%">
      <Box display="flex" justifyContent="center" alignItems="center" height="4rem">
        <TextField
          placeholder="Enter playlist name"
          value={playlistName}
          onChange={handleNameChange}
          sx={{
            width: '100%',
            maxWidth: theme.spacing(150),
            fontWeight: 500,
            textAlign: 'center',
            outline: 'none'
          }}
        />
      </Box>
      <Box
        backgroundColor="rgba(1, 12, 63, 0.7)"
        display="flex"
        flexDirection="column"
        height={theme.spacing(250)}
        width="100%"
        sx={{
          overflowY: 'auto'
        }}
      >
        <TrackList tracks={playlistTracks} buttonType="playlist" onRemove={onRemove} />
      </Box>
      <Box display="flex" justifyContent="center">
        <Button
          onClick={handlePlaylistSave}
          disabled={isSaveDisabled}
          sx={{
            width: '100%',
            maxWidth: theme.spacing(150)
          }}
        >
          Save to Spotify
        </Button>
      </Box>
    </Box>
  )
}

export default Playlist
