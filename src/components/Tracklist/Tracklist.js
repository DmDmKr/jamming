import React from 'react'
import './Tracklist.css'
import Track from '../Track/Track'

const TrackList = ({ tracks, onAdd, onRemove, buttonType }) => {
  return (
    <div className="TrackList">
      {tracks.map(track => (
        <Track
          track={track}
          key={track.id}
          onAdd={onAdd}
          buttonType={buttonType}
          onRemove={onRemove}
        />
      ))}
    </div>
  )
}

export default TrackList
