const clientId = 'a1f9661a0ed64076a6c7e6f0d1f21980' // Insert client ID here.
const redirectUri = 'http://localhost:3000/' // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
const userId = 'bccb3fektjx7r1urji3hxehpn'
const spotifyApiPrefix = `https://api.spotify.com/v1`
let accessToken

const Spotify = {
  getAccessToken() {
    const storedToken = localStorage.getItem('accessToken')

    if (storedToken) {
      return storedToken
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)

    if (accessTokenMatch && expiresInMatch) {
      const accessToken = accessTokenMatch[1]
      const expiresIn = Number(expiresInMatch[1])
      window.setTimeout(() => {
        localStorage.removeItem('accessToken')
      }, expiresIn * 1000)
      window.history.pushState('Access Token', null, '/') // This clears the parameters, allowing us to grab a new access token when it expires.
      localStorage.setItem('accessToken', accessToken) // Save the access token in local storage
      return accessToken
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
      window.location = accessUrl
    }
  },

  async search(term) {
    const accessToken = Spotify.getAccessToken()
    return fetch(`${spotifyApiPrefix}/search?q=${term}&type=track`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    })
      .then((response) => {
        return response.json()
      })
      .then((jsonResponse) => {
        if (jsonResponse.tracks.items) {
          return jsonResponse.tracks.items.map((item) => ({
            id: item.id,
            name: item.name,
            artist: item.artists.map((artist) => artist.name).join(', '),
            album: item.album.name,
            uri: item.uri
          }))
        } else {
          throw new Error(jsonResponse.error.description)
        }
      })
      .catch((error) => {
        alert(error.message)
      })
  },

  async addTracksToPlaylist(accessToken, playlistId, tracksToAdd) {
    const trackIdsToAdd = tracksToAdd.map((track) => track.uri)

    return await fetch(`${spotifyApiPrefix}/users/${userId}/playlists/${playlistId}/tracks`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      body: JSON.stringify(trackIdsToAdd)
    }).catch((error) => {
      alert(error.message)
    })
  },

  async savePlaylist(playlistName, playlistTracks) {
    try {
      const accessToken = Spotify.getAccessToken()
      const createPlaylistResponse = await fetch(`${spotifyApiPrefix}/users/${userId}/playlists`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: playlistName, description: 'test jamming playlist' })
      })

      if (createPlaylistResponse.ok) {
        const jsonResponse = await createPlaylistResponse.json()
        const playlistId = jsonResponse.id
        await this.addTracksToPlaylist(accessToken, playlistId, playlistTracks)
        alert(`Playlist ${playlistName} saved to your Spotify account successfully.`)
      } else {
        throw new Error('Failed to create playlist.')
      }
    } catch (error) {
      alert(error.message)
    }
  }
}

export default Spotify
