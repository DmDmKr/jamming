import httpClient from '../utils/httpClient'

const userId = import.meta.env.VITE_SPOTIFY_USER_ID

if (!userId) {
  console.error('Missing VITE_SPOTIFY_USER_ID in .env file')
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

  try {
    const data = await httpClient.get('/search', {
      q: query,
      type: 'track',
      limit: 20
    })

    return data.tracks?.items?.map(transformTrack) || []
  } catch (error) {
    console.error('Search error:', error)
    throw error
  }
}

export const createPlaylist = async (name, description = 'Created with Jamming') => {
  try {
    const playlist = await httpClient.post(`/users/${userId}/playlists`, {
      name,
      description,
      public: true
    })

    return playlist.id
  } catch (error) {
    console.error('Create playlist error:', error)
    throw error
  }
}

export const addTracksToPlaylist = async (playlistId, trackUris) => {
  if (!trackUris?.length) {
    throw new Error('No tracks to add')
  }

  try {
    await httpClient.post(`/playlists/${playlistId}/tracks`, {
      uris: trackUris
    })
  } catch (error) {
    console.error('Add tracks error:', error)
    throw error
  }
}

export const savePlaylist = async (name, tracks) => {
  if (!name?.trim()) {
    throw new Error('Playlist name is required')
  }

  if (!tracks?.length) {
    throw new Error('Cannot save empty playlist')
  }

  try {
    const playlistId = await createPlaylist(name)
    const trackUris = tracks.map(track => track.uri)
    await addTracksToPlaylist(playlistId, trackUris)

    return { success: true, playlistId, name }
  } catch (error) {
    console.error('Save playlist error:', error)
    throw error
  }
}
