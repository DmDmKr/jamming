import React from 'react'
import './App.css'
import SearchBar from '../SearchBar/SearchBar'
import SearchResults from '../SearchResults/SearchResults'
import Playlist from '../Playlist/Playlist'
import Spotify from '../../util/Spotify'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchResults: [
        { name: 'Track1', artist: 'artist1', album: 'album1', id: 1, uri: 'spotify:track:06WUUNf7q18NZfjIsQFsfa' },
        { name: 'Track2', artist: 'artist2', album: 'album2', id: 2, uri: 'spotify:track:1DhCdQMyNLklKGxBheRFxL' },
        { name: 'Track3', artist: 'artist3', album: 'album3', id: 3, uri: 'spotify:track:6EPRKhUOdiFSQwGBRBbvsZ' }
      ],
      playlistName: 'New Playlist',
      playlistTracks: [],
      error: null
    }
  }

  addTrack = (track) => {
    const isTrackInPlaylist = this.state.playlistTracks.some((playlistTrack) => playlistTrack.id === track.id)
    if (!isTrackInPlaylist) {
      const updatedPlaylistTracks = [...this.state.playlistTracks, track]
      this.setState({ playlistTracks: updatedPlaylistTracks })
    }
  }

  removeTrack = (track) => {
    const updatedPlaylistTracks = this.state.playlistTracks.filter((playlistTrack) => playlistTrack.id !== track.id)
    this.setState({ playlistTracks: updatedPlaylistTracks })
  }

  changePlaylistName = (updatedPlaylistName) => {
    this.setState({ playlistName: updatedPlaylistName })
  }

  savePlaylist = (playlistTracks) => {
    console.log(`Saving playlist ${this.state.playlistName}`)
    playlistTracks.map((track) => {
      console.log(track.uri)
    })
  }

  searchSpotify = (term) => {
    Spotify.search(term)
      .then((tracks) => {
        if (tracks.length > 0) {
          this.setState({ searchResults: tracks, error: null })
        } else {
          this.setState({ searchResults: null, error: 'No tracks found.' })
        }
      })
      .catch((error) => {
        this.setState({ searchResults: null, error: 'An error occurred while fetching data.' })
      })
  }

  render() {
    return (
      <div className="App">
        <h1>Jamming</h1>
        <SearchBar searchSpotify={this.searchSpotify} />
        <div className="SongsListsContainer">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
          <Playlist playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} playlistName={this.state.playlistName} onNameChange={this.changePlaylistName} onPlaylistSave={this.savePlaylist} />
        </div>
      </div>
    )
  }
}

export default App
