import { useState } from 'react'
import { savePlaylist as savePlaylistToSpotify } from '../services/spotifyAPI'
import { useToast } from '../contexts/ToastContext'
import { useAuth } from '../contexts/AuthContext'

const usePlaylist = () => {
  const { showSuccess, showError } = useToast()
  const { setIsAuthenticated } = useAuth()
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const addTrack = track => {
    setPlaylistTracks(prevTracks => {
      const isTrackInPlaylist = prevTracks.some(playlistTrack => playlistTrack.id === track.id)
      if (isTrackInPlaylist) return prevTracks
      return [...prevTracks, track]
    })
  }

  const removeTrack = track => {
    setPlaylistTracks(prevTracks =>
      prevTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    )
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

  const clearPlaylist = () => {
    setPlaylistTracks([])
  }

  return {
    playlistTracks,
    isLoading,
    addTrack,
    removeTrack,
    savePlaylist,
    clearPlaylist
  }
}

export default usePlaylist
