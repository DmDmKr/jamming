import { useState, useCallback } from 'react'
import Spotify from '../util/Spotify'

const useSpotify = () => {
  const [searchResults, setSearchResults] = useState([])
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [playlistName, setPlaylistName] = useState('New Playlist')
  const [term, setTerm] = useState('')
  const [error, setError] = useState(null)

  const addTrack = useCallback(
    track => {
      const isTrackInPlaylist = playlistTracks.some(playlistTrack => playlistTrack.id === track.id)

      if (!isTrackInPlaylist) {
        setPlaylistTracks(prevTracks => [...prevTracks, track])
        setSearchResults(prevResults =>
          prevResults.filter(playlistTrack => playlistTrack.id !== track.id)
        )
      }
    },
    [playlistTracks]
  )

  const removeTrack = useCallback(track => {
    setPlaylistTracks(prevTracks =>
      prevTracks.filter(playlistTrack => playlistTrack.id !== track.id)
    )
    setSearchResults(prevResults => [track, ...prevResults])
  }, [])

  const changePlaylistName = useCallback(updatedPlaylistName => {
    setPlaylistName(updatedPlaylistName)
  }, [])

  const savePlaylist = useCallback(async () => {
    try {
      await Spotify.savePlaylist(playlistName, playlistTracks)
      setPlaylistName('')
      setPlaylistTracks([])
    } catch (error) {
      console.error('Error saving playlist:', error)
      setError('An error occurred while saving the playlist.')
    }
  }, [playlistName, playlistTracks])

  const searchSpotify = useCallback(async term => {
    try {
      const tracks = await Spotify.search(term)
      if (tracks.length > 0) {
        setSearchResults(tracks)
        setError(null)
      } else {
        setSearchResults([])
        setError('No tracks found.')
      }
    } catch (error) {
      setSearchResults([])
      setError('An error occurred while fetching data.')
    }
  }, [])

  const clearAll = useCallback(() => {
    setSearchResults([])
    setError(null)
    setPlaylistTracks([])
    setPlaylistName('New Playlist')
    setTerm('')
  }, [])

  return {
    searchResults,
    playlistTracks,
    playlistName,
    error,
    term,
    setTerm,
    addTrack,
    removeTrack,
    changePlaylistName,
    savePlaylist,
    searchSpotify,
    clearAll
  }
}

export default useSpotify
