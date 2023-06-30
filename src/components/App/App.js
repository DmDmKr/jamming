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
      searchResults: [],
      playlistName: 'New Playlist',
      playlistTracks: [],
      error: null
    }
  }

  addTrack = (track) => {
    const isTrackInPlaylist = this.state.playlistTracks.some((playlistTrack) => playlistTrack.id === track.id)

    if (!isTrackInPlaylist) {
      const updatedPlaylistTracks = [...this.state.playlistTracks, track]
      const updatedSearchResults = this.state.searchResults.filter((playlistTrack) => playlistTrack.id !== track.id)
      this.setState({ playlistTracks: updatedPlaylistTracks, searchResults: updatedSearchResults })
    }
  }

  removeTrack = (track) => {
    const updatedPlaylistTracks = this.state.playlistTracks.filter((playlistTrack) => playlistTrack.id !== track.id)
    const updatedSearchResults = [track, ...this.state.searchResults]
    this.setState({ playlistTracks: updatedPlaylistTracks, searchResults: updatedSearchResults })
  }

  changePlaylistName = (updatedPlaylistName) => {
    this.setState({ playlistName: updatedPlaylistName })
  }

  savePlaylist = async () => {
    try {
      await Spotify.savePlaylist(this.state.playlistName, this.state.playlistTracks)
      this.setState({ playlistName: '', playlistTracks: [] })
    } catch (error) {
      // Handle any error that occurred during saving the playlist
      console.error('Error saving playlist:', error)
      // Optionally, you can display an error message to the user
      this.setState({ error: 'An error occurred while saving the playlist.' })
    }
  }

  searchSpotify = async (term) => {
    await Spotify.search(term)
      .then((tracks) => {
        if (tracks.length > 0) {
          this.setState({ searchResults: tracks, error: null })
        } else {
          this.setState({ searchResults: [], error: 'No tracks found.' })
        }
      })
      .catch((error) => {
        this.setState({ searchResults: [], error: 'An error occurred while fetching data.' })
      })
  }

  render() {
    return (
      <div className="App">
        <h1>Jamming</h1>
        <SearchBar searchSpotify={this.searchSpotify} />
        <div className="SongsListsContainer">
          <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} error={this.state.error} />
          <Playlist playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} playlistName={this.state.playlistName} onNameChange={this.changePlaylistName} onPlaylistSave={this.savePlaylist} />
        </div>
      </div>
    )
  }
}

export default App
