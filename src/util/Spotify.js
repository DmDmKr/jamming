// Legacy facade - delegates to new modular services
// This file exists for backward compatibility
import { getAccessToken, startAuthFlow, isAuthenticated } from '../services/spotifyAuth'
import { searchTracks, savePlaylist } from '../services/spotifyAPI'

const Spotify = {
  getAccessToken,
  startAuthFlow,
  isAuthenticated,
  search: searchTracks,
  savePlaylist
}

export default Spotify
