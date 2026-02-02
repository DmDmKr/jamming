import { useState, useEffect } from 'react'
import { getAccessToken, startAuthFlow } from '../services/spotifyAuth'

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // First check if there's an authorization code in the URL
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')

        if (code) {
          // We're returning from Spotify - exchange the code
          console.log('Authorization code detected, exchanging for token...')
          const token = await getAccessToken()
          if (token) {
            console.log('Token obtained successfully')
            setIsAuthenticated(true)
          } else {
            console.error('Failed to exchange code for token')
            setIsAuthenticated(false)
          }
        } else {
          // No code in URL - check if we have a stored valid token
          const storedToken = localStorage.getItem('spotify_access_token')
          const expiresAt = localStorage.getItem('spotify_token_expires_at')

          if (storedToken && expiresAt && Date.now() < parseInt(expiresAt)) {
            console.log('Valid stored token found')
            setIsAuthenticated(true)
          } else {
            console.log('No valid token - user needs to authenticate')
            setIsAuthenticated(false)
          }
        }
      } catch (error) {
        console.error('Authentication initialization failed:', error)
        setIsAuthenticated(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async () => {
    await startAuthFlow()
  }

  const logout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('spotify_access_token')
    localStorage.removeItem('spotify_token_expires_at')
  }

  return {
    isAuthenticated,
    setIsAuthenticated,
    login,
    logout
  }
}

export default useAuth
