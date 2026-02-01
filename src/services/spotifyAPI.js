import { getAccessToken } from './spotifyAuth'

const BASE_URL = 'https://api.spotify.com/v1'
const userId = import.meta.env.VITE_SPOTIFY_USER_ID

if (!userId) {
  console.error('Missing VITE_SPOTIFY_USER_ID in .env file')
}

const apiRequest = async (endpoint, options = {}) => {
  const token = await getAccessToken()

  if (!token) {
    throw new Error('Not authenticated')
  }

  const config = {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config)

  if (response.status === 401) {
    throw new Error('Session expired')
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.error?.message || `Request failed: ${response.statusText}`)
  }

  return await response.json()
}

// Transform track data from Spotify API format to app format
const transformTrack = item => ({
  id: item.id,
  name: item.name,
  artist: item.artists.map(artist => artist.name).join(', '),
  album: item.album.name,
  uri: item.uri
})

export const searchTracks = async query => {
  if (!query?.trim()) {
    return []
  }

  const params = new URLSearchParams({
    q: query,
    type: 'track',
    limit: '20'
  })

  const data = await apiRequest(`/search?${params}`)
  return data.tracks?.items?.map(transformTrack) || []
}

export const createPlaylist = async (name, description = 'Created with Jamming') => {
  const playlist = await apiRequest(`/users/${userId}/playlists`, {
    method: 'POST',
    body: JSON.stringify({
      name,
      description,
      public: true
    })
  })

  return playlist.id
}

export const addTracksToPlaylist = async (playlistId, trackUris) => {
  if (!trackUris?.length) {
    throw new Error('No tracks to add')
  }

  await apiRequest(`/playlists/${playlistId}/tracks`, {
    method: 'POST',
    body: JSON.stringify({
      uris: trackUris
    })
  })
}

export const savePlaylist = async (name, tracks) => {
  if (!name?.trim()) {
    throw new Error('Playlist name is required')
  }

  if (!tracks?.length) {
    throw new Error('Cannot save empty playlist')
  }

  const playlistId = await createPlaylist(name)
  const trackUris = tracks.map(track => track.uri)
  await addTracksToPlaylist(playlistId, trackUris)

  return { success: true, playlistId, name }
}
