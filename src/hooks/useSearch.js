import { useState, useRef } from 'react'
import { getAccessToken, startAuthFlow } from '../services/spotifyAuth'
import { searchTracks } from '../services/spotifyAPI'
import { useToast } from '../contexts/ToastContext'

const useSearch = setIsAuthenticated => {
  const { showError } = useToast()
  const [searchResults, setSearchResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const abortControllerRef = useRef(null)

  const search = async term => {
    // Cancel previous search if it exists leveraging AbortController
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new AbortController for this search
    abortControllerRef.current = new AbortController()
    const { signal } = abortControllerRef.current

    setIsLoading(true)
    try {
      // Check if we need to authenticate first
      const token = await getAccessToken()
      if (!token) {
        // Start auth flow
        await startAuthFlow()
        return
      }

      const tracks = await searchTracks(term, signal)
      if (tracks.length > 0) {
        setSearchResults(tracks)
      } else {
        setSearchResults([])
        showError('No tracks found.')
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Search aborted')
        return
      }

      console.error('Search error:', error)
      setSearchResults([])
      if (
        error.message.includes('not authenticated') ||
        error.message.includes('Session expired')
      ) {
        showError('Please log in to search for tracks.')
        if (setIsAuthenticated) {
          setIsAuthenticated(false)
        }
        // Optionally start auth flow automatically
        await startAuthFlow()
      } else {
        showError('An error occurred while fetching data.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const removeFromResults = trackId => {
    setSearchResults(prevResults => prevResults.filter(track => track.id !== trackId))
  }

  const addToResults = track => {
    setSearchResults(prevResults => [track, ...prevResults])
  }

  const clearResults = () => {
    setSearchResults([])
  }

  return {
    searchResults,
    isLoading,
    search,
    removeFromResults,
    addToResults,
    clearResults
  }
}

export default useSearch
