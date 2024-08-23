import React from 'react'
import { Box, Typography, Button } from '@mui/material'

const Track = ({ track, buttonType, onAdd, onRemove }) => {
  const handleAdd = () => {
    onAdd(track)
  }

  const handleRemove = () => {
    onRemove(track)
  }

  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="nowrap">
      <Box flex={1}>
        <Typography variant="h6" component="h3">
          {track.name}
        </Typography>
        <Typography
          variant="body2"
          fontWeight="300"
          color="rgba(256, 256, 256, 0.8)"
          fontSize="0.83rem"
        >
          {track.album} - {track.artist}
        </Typography>
      </Box>
      <Button
        onClick={buttonType === 'search' ? handleAdd : handleRemove}
        sx={{
          mr: 5,
          padding: '0.5rem',
          transition: 'color 0.25s'
        }}
      >
        {buttonType === 'search' ? '+' : '-'}
      </Button>
    </Box>
  )
}

export default Track
