import React from 'react'
import './Track.css'

class Track extends React.Component {
  constructor(props) {
    super(props)
  }

  handleAdd = () => {
    this.props.onAdd(this.props.track)
  }

  handleRemove = () => {
    this.props.onRemove(this.props.track)
  }

  render() {
    return (
      <div className="Track">
        <div className="Track-information">
          <h3>{this.props.track.name}</h3>
          <p>
            {this.props.track.album} - {this.props.track.artist}
          </p>
          {this.props.buttonType === 'search' ? <button onClick={this.handleAdd}>+</button> : <button onClick={this.handleRemove}>-</button>}
        </div>
      </div>
    )
  }
}

export default Track
