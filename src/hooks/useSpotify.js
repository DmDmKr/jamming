import { useState, useEffect } from 'react'
import { getAccessToken, startAuthFlow } from '../services/spotifyAuth'
import { searchTracks, savePlaylist as savePlaylistToSpotify } from '../services/spotifyAPI'
import { useToast } from '../contexts/ToastContext'

const useSpotify = () => {
  const { showSuccess, showError } = useToast()
  const [searchResults, setSearchResults] = useState([])
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [term, setTerm] = useState('')
  const [error, setError] = useState(null)
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

  const addTrack = track => {
    setPlaylistTracks(prevTracks => {
      const isTrackInPlaylist = prevTracks.some(playlistTrack => playlistTrack.id === track.id)
      if (isTrackInPlaylist) return prevTracks
      return [...prevTracks, track]
    })
    setSearchResults(prevResults =>
      prevResults.filter(playlistTrack => playlistTrack.id !== track.id)
    )
  }

  const removeTrack = track => {
    setPlaylistTracks(prevTracks =>
      prevTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    )
    setSearchResults(prevResults => [track, ...prevResults])
  }

  const savePlaylist = async playlistName => {
    if (!playlistName?.trim()) {
      setError('Playlist name is required')
      return false
    }

    if (playlistTracks.length === 0) {
      setError('Cannot save empty playlist')
      return false
    }

    try {
      const result = await savePlaylistToSpotify(playlistName, playlistTracks)
      showSuccess(`Playlist "${result.name}" saved to your Spotify account successfully!`)
      setPlaylistTracks([])
      setError(null)
      return true
    } catch (error) {
      console.error('Error saving playlist:', error)
      const errorMessage = error.message || 'Failed to save playlist.'
      if (
        error.message.includes('not authenticated') ||
        error.message.includes('Session expired')
      ) {
        showError('Session expired. Please log in again.')
        setError('Session expired. Please log in again.')
        setIsAuthenticated(false)
      } else {
        showError(errorMessage)
        setError(errorMessage)
      }
      return false
    }
  }

  const searchSpotify = async term => {
    try {
      // Check if we need to authenticate first
      const token = await getAccessToken()
      if (!token) {
        // Start auth flow
        await startAuthFlow()
        return
      }

      const tracks = await searchTracks(term)
      if (tracks.length > 0) {
        setSearchResults(tracks)
        setError(null)
      } else {
        setSearchResults([])
        setError('No tracks found.')
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
      if (
        error.message.includes('not authenticated') ||
        error.message.includes('Session expired')
      ) {
        const errorMessage = 'Please log in to search for tracks.'
        showError(errorMessage)
        setError(errorMessage)
        setIsAuthenticated(false)
        // Optionally start auth flow automatically
        await startAuthFlow()
      } else {
        const errorMessage = 'An error occurred while fetching data.'
        showError(errorMessage)
        setError(errorMessage)
      }
    }
  }

  const clearAll = () => {
    setSearchResults([])
    setError(null)
    setPlaylistTracks([])
    setTerm('')
  }

  return {
    searchResults,
    playlistTracks,
    error,
    term,
    isAuthenticated,
    setTerm,
    addTrack,
    removeTrack,
    savePlaylist,
    searchSpotify,
    clearAll
  }
}

export default useSpotify
