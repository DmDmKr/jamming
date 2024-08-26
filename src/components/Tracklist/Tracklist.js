import React from 'react'
import Track from '../Track/Track'
import { Box } from '@mui/material'

const TrackList = ({ tracks, onAdd, onRemove, buttonType }) => {
  return (
    <Box display="flex" flexDirection="column" width="100%">
      {tracks.map(track => (
        <Track
          track={track}
          key={track.id}
          onAdd={onAdd}
          buttonType={buttonType}
          onRemove={onRemove}
        />
      ))}
    </Box>
  )
}

export default TrackList
