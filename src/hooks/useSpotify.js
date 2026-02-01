import { useState, useEffect } from 'react'
import { getAccessToken, startAuthFlow } from '../services/spotifyAuth'
import { searchTracks, savePlaylist as savePlaylistToSpotify } from '../services/spotifyAPI'
import { useToast } from '../contexts/ToastContext'

const useSpotify = () => {
  const { showSuccess, showError } = useToast()
  const [searchResults, setSearchResults] = useState([])
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [term, setTerm] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
      showError('Playlist name is required')
      return false
    }

    if (playlistTracks.length === 0) {
      showError('Cannot save empty playlist')
      return false
    }

    setIsLoading(true)
    try {
      const result = await savePlaylistToSpotify(playlistName, playlistTracks)
      showSuccess(`Playlist "${result.name}" saved to your Spotify account successfully!`)
      setPlaylistTracks([])
      return true
    } catch (error) {
      console.error('Error saving playlist:', error)
      const errorMessage = error.message || 'Failed to save playlist.'
      if (
        error.message.includes('not authenticated') ||
        error.message.includes('Session expired')
      ) {
        showError('Session expired. Please log in again.')
        setIsAuthenticated(false)
      } else {
        showError(errorMessage)
      }
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const searchSpotify = async term => {
    setIsLoading(true)
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
      } else {
        setSearchResults([])
        showError('No tracks found.')
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
      if (
        error.message.includes('not authenticated') ||
        error.message.includes('Session expired')
      ) {
        showError('Please log in to search for tracks.')
        setIsAuthenticated(false)
        // Optionally start auth flow automatically
        await startAuthFlow()
      } else {
        showError('An error occurred while fetching data.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearAll = () => {
    setSearchResults([])
    setPlaylistTracks([])
    setTerm('')
  }

  return {
    searchResults,
    playlistTracks,
    term,
    isAuthenticated,
    isLoading,
    setTerm,
    addTrack,
    removeTrack,
    savePlaylist,
    searchSpotify,
    clearAll
  }
}

export default useSpotify
