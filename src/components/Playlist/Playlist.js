import React, { useState, useEffect } from 'react'
import { Box, TextField, Button, useTheme } from '@mui/material'
import TrackList from '../Tracklist/Tracklist'

const Playlist = ({
  playlistName: initialPlaylistName,
  playlistTracks,
  onNameChange,
  onRemove,
  onPlaylistSave
}) => {
  const [playlistName, setPlaylistName] = useState(initialPlaylistName)
  const theme = useTheme()

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
      setPlaylistName('')
    } catch (error) {
      console.error('Error saving playlist:', error)
      alert('Failed to save your playlist! Please try again later')
    }
  }

  const isSaveDisabled = playlistTracks.length === 0 || playlistName === ''

  return (
    <Box display="flex" flexDirection="column" gap={5} color="aliceblue" height="100%">
      <Box display="flex" justifyContent="center">
        <TextField
          placeholder="Enter playlist name"
          value={playlistName}
          onChange={handleNameChange}
          sx={{
            width: theme.spacing(100), // Set a fixed width for the TextField
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
        width={theme.spacing(300)}
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
            width: theme.spacing(100) // Set a fixed width for the Button
          }}
        >
          Save to Spotify
        </Button>
      </Box>
    </Box>
  )
}

export default Playlist
