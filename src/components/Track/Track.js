import React from 'react'
import './Track.css'

const Track = ({ track, buttonType, onAdd, onRemove }) => {
  const handleAdd = () => {
    onAdd(track)
  }

  const handleRemove = () => {
    onRemove(track)
  }

  return (
    <div className="Track">
      <div className="Track-information">
        <h3>{track.name}</h3>
        <p>
          {track.album} - {track.artist}
        </p>
        {buttonType === 'search' ? (
          <button onClick={handleAdd}>+</button>
        ) : (
          <button onClick={handleRemove}>-</button>
        )}
      </div>
    </div>
  )
}

export default Track
