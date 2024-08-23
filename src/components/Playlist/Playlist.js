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
    <Box display="flex" flexDirection="column" gap={10} height="100%">
      <Box
        backgroundColor="rgba(1, 12, 63, 0.7)"
        display="flex"
        flexDirection="column"
        height={theme.spacing(250)}
        width={theme.spacing(300)}
        color="aliceblue"
        sx={{
          overflowY: 'auto'
        }}
      >
        <Box>
          <TextField
            placeholder="Enter playlist name"
            value={playlistName}
            onChange={handleNameChange}
            sx={{
              fontWeight: 500,
              textAlign: 'center',
              outline: 'none',
              marginTop: 8
            }}
          />
          <TrackList tracks={playlistTracks} buttonType="playlist" onRemove={onRemove} />
        </Box>
      </Box>
      <Button onClick={handlePlaylistSave} disabled={isSaveDisabled}>
        Save to Spotify
      </Button>
    </Box>
  )
}

export default Playlist
