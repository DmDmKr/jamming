import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import App from '../components/App'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../theme'
import { ToastProvider } from '../contexts/ToastContext'
import { mockTracks, mockPlaylistResponse } from './mocks'
import * as spotifyAPI from '../services/spotifyAPI'

const renderApp = () => {
  return render(
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  )
}

const user = userEvent.setup()
const getSearchInput = () => screen.getByPlaceholderText(/search spotify/i)
const getSearchButton = () => screen.getByRole('button', { name: /search for tracks/i })
const getPlaylistNameInput = () => screen.getByPlaceholderText(/enter playlist name/i)
const getSavePlaylistButton = () =>
  screen.getByRole('button', { name: /save playlist to spotify/i })
const getAddTrackButton = trackName =>
  screen.getByRole('button', { name: new RegExp(`add ${trackName} to playlist`, 'i') })
const getRemoveTrackButton = trackName =>
  screen.getByRole('button', { name: new RegExp(`remove ${trackName} from playlist`, 'i') })

describe('Jamming Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    spotifyAPI.searchTracks.mockResolvedValue(mockTracks)
    spotifyAPI.savePlaylist.mockResolvedValue(mockPlaylistResponse)
    renderApp()
  })

  vi.mock('../services/spotifyAPI', () => ({
    searchTracks: vi.fn(),
    savePlaylist: vi.fn()
  }))

  describe('Search and save playlist flow: positive scenarios', () => {
    it('should search for tracks, display results, and allow adding/removing tracks', async () => {
      const searchInput = getSearchInput()
      const searchButton = getSearchButton()

      await user.type(searchInput, 'test query')
      await user.click(searchButton)

      await waitFor(() => {
        expect(spotifyAPI.searchTracks).toHaveBeenCalledWith('test query')
      })

      expect(await screen.findByText('Test Song 1')).toBeInTheDocument()
      expect(await screen.findByText('Test Album 1 - Test Artist 1')).toBeInTheDocument()
      expect(await screen.findByText('Test Song 2')).toBeInTheDocument()

      const addButton = getAddTrackButton('Test Song 1')
      await user.click(addButton)

      const playlistSection = screen.getByRole('region', { name: /your playlist/i })
      expect(playlistSection).toHaveTextContent('Test Song 1')

      const removeButton = getRemoveTrackButton('Test Song 1')
      await user.click(removeButton)

      const searchSection = screen.getByRole('region', { name: /search results/i })
      expect(searchSection).toHaveTextContent('Test Song 1')
    })

    it('should save playlist, reset its name and show success toast', async () => {
      const searchInput = getSearchInput()
      const searchButton = getSearchButton()

      await user.type(searchInput, 'test')
      await user.click(searchButton)

      const addButton1 = await screen.findByRole('button', {
        name: /add test song 1 to playlist/i
      })
      const addButton2 = screen.getByRole('button', { name: /add test song 2 to playlist/i })

      await user.click(addButton1)
      await user.click(addButton2)

      const playlistNameInput = getPlaylistNameInput()
      await user.clear(playlistNameInput)
      await user.type(playlistNameInput, 'My Test Playlist')

      const saveButton = getSavePlaylistButton()
      await user.click(saveButton)

      await waitFor(() => {
        expect(spotifyAPI.savePlaylist).toHaveBeenCalledWith('My Test Playlist', [
          mockTracks[0],
          mockTracks[1]
        ])
      })

      expect(
        await screen.findByText(
          /playlist "my test playlist" saved to your spotify account successfully!/i
        )
      ).toBeInTheDocument()

      await waitFor(() => {
        expect(playlistNameInput).toHaveValue('New Playlist')
      })
    })
  })

  describe('Search and save playlist flow: error scenarios', () => {
    it('should show error toast when search fails', async () => {
      // Mock search failure
      spotifyAPI.searchTracks.mockRejectedValueOnce(new Error('Network error'))

      const searchInput = getSearchInput()
      const searchButton = getSearchButton()

      await user.type(searchInput, 'test')
      await user.click(searchButton)

      expect(await screen.findByText(/an error occurred while fetching data/i)).toBeInTheDocument()
    })

    it('should show error toast when save fails', async () => {
      // Mock save failure
      spotifyAPI.savePlaylist.mockRejectedValueOnce(new Error('Failed to create playlist'))
      const searchInput = getSearchInput()
      const searchButton = getSearchButton()

      await user.type(searchInput, 'test')
      await user.click(searchButton)

      const addButton = await screen.findByRole('button', {
        name: /add test song 1 to playlist/i
      })
      await user.click(addButton)

      const playlistNameInput = getPlaylistNameInput()
      await user.clear(playlistNameInput)
      await user.type(playlistNameInput, 'Test Playlist')

      const saveButton = getSavePlaylistButton()
      await user.click(saveButton)

      expect(await screen.findByText(/failed to create playlist/i)).toBeInTheDocument()
    })
  })

  describe('loading states tests', () => {
    it('should show loading state during search', async () => {
      // Mock slow search
      spotifyAPI.searchTracks.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockTracks), 100))
      )

      const searchInput = getSearchInput()
      const searchButton = getSearchButton()

      await user.type(searchInput, 'test')
      await user.click(searchButton)

      expect(screen.getByText(/loading\.\.\./i)).toBeInTheDocument()
      expect(searchButton).toBeDisabled()

      await waitFor(() => {
        expect(screen.getByText(/search/i)).toBeInTheDocument()
        expect(searchButton).not.toBeDisabled()
      })
    })

    it('should show loading state during save', async () => {
      // Mock slow save
      spotifyAPI.savePlaylist.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(mockPlaylistResponse), 100))
      )

      const searchInput = getSearchInput()
      const searchButton = getSearchButton()

      await user.type(searchInput, 'test')
      await user.click(searchButton)

      const addButton = await screen.findByRole('button', {
        name: /add test song 1 to playlist/i
      })
      await user.click(addButton)

      const saveButton = getSavePlaylistButton()
      await user.click(saveButton)

      expect(screen.getByText(/saving\.\.\./i)).toBeInTheDocument()
      expect(saveButton).toBeDisabled()

      await waitFor(() => {
        expect(screen.getByText(/save to spotify/i)).toBeInTheDocument()
      })
    })
  })
})
