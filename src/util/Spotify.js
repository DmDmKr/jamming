const clientId = 'a1f9661a0ed64076a6c7e6f0d1f21980' // Insert client ID here.
const redirectUri = 'http://localhost:3000/' // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
let accessToken

const Spotify = {
  getAccessToken() {
    if (accessToken) {
      return accessToken
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)
    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1]
      const expiresIn = Number(expiresInMatch[1])
      window.setTimeout(() => (accessToken = ''), expiresIn * 1000)
      window.history.pushState('Access Token', null, '/') // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`
      window.location = accessUrl
    }
  },

  async search(term) {
    const accessToken = Spotify.getAccessToken()
    return fetch(`https://api.spotify.com/v1/search?q=${term}&type=track`, {
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
        if (error instanceof SyntaxError) {
          alert('Sorry, we could not process your request at this time. Please try again later.')
        } else {
          alert(error.message)
        }
      })
  }
}

export default Spotify
