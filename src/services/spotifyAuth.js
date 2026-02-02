const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID
const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI

if (!clientId || !redirectUri) {
  console.error('Missing Spotify OAuth configuration. Check your .env file.')
}

// Token state
let accessToken = null
let isExchangingCode = false

// PKCE helper functions
const generateRandomString = length => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

const sha256 = async plain => {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

const base64urlencode = arrayBuffer => {
  return btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// Token storage utilities
const TOKEN_KEY = 'spotify_access_token'
const EXPIRY_KEY = 'spotify_token_expires_at'
const VERIFIER_KEY = 'spotify_code_verifier'

const storeToken = (token, expiresIn) => {
  accessToken = token
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(EXPIRY_KEY, Date.now() + expiresIn * 1000)
}

const clearToken = () => {
  accessToken = null
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(EXPIRY_KEY)
}

const getStoredToken = () => {
  const token = localStorage.getItem(TOKEN_KEY)
  const expiresAt = localStorage.getItem(EXPIRY_KEY)

  if (token && expiresAt && Date.now() < parseInt(expiresAt)) {
    accessToken = token
    return token
  }

  return null
}

// Main authentication functions
export const getAccessToken = async () => {
  // Check memory first
  if (accessToken) return accessToken

  // Check stored token
  const storedToken = getStoredToken()
  if (storedToken) {
    // Clean URL if code still present
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.has('code')) {
      window.history.replaceState({}, document.title, '/')
    }
    return storedToken
  }

  // Check for authorization code
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  if (code) {
    return await exchangeCodeForToken(code)
  }

  return null
}

const exchangeCodeForToken = async code => {
  if (isExchangingCode) {
    await new Promise(resolve => setTimeout(resolve, 500))
    return accessToken
  }

  isExchangingCode = true
  const codeVerifier = localStorage.getItem(VERIFIER_KEY)

  if (!codeVerifier) {
    console.error('Code verifier not found')
    isExchangingCode = false
    window.history.replaceState({}, document.title, '/')
    return null
  }

  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: clientId,
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
        code_verifier: codeVerifier
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error_description || 'Token exchange failed')
    }

    const { access_token, expires_in } = await response.json()

    storeToken(access_token, expires_in)
    localStorage.removeItem(VERIFIER_KEY)
    window.history.replaceState({}, document.title, '/')

    console.log('✓ Authentication successful')
    isExchangingCode = false
    return access_token
  } catch (error) {
    console.error('Token exchange error:', error)
    localStorage.removeItem(VERIFIER_KEY)
    window.history.replaceState({}, document.title, '/')
    isExchangingCode = false
    return null
  }
}

export const startAuthFlow = async () => {
  const codeVerifier = generateRandomString(64)
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64urlencode(hashed)

  localStorage.setItem(VERIFIER_KEY, codeVerifier)

  const authUrl = new URL('https://accounts.spotify.com/authorize')
  authUrl.searchParams.append('client_id', clientId)
  authUrl.searchParams.append('response_type', 'code')
  authUrl.searchParams.append('redirect_uri', redirectUri)
  authUrl.searchParams.append('scope', 'playlist-modify-public')
  authUrl.searchParams.append('code_challenge_method', 'S256')
  authUrl.searchParams.append('code_challenge', codeChallenge)

  window.location.href = authUrl.toString()
}

export const logout = () => {
  clearToken()
  localStorage.removeItem(VERIFIER_KEY)
}

export const isAuthenticated = async () => {
  const token = await getAccessToken()
  return !!token
}
