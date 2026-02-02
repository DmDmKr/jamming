export const mockTracks = [
  {
    id: '1',
    name: 'Test Song 1',
    artist: 'Test Artist 1',
    album: 'Test Album 1',
    uri: 'spotify:track:1'
  },
  {
    id: '2',
    name: 'Test Song 2',
    artist: 'Test Artist 2',
    album: 'Test Album 2',
    uri: 'spotify:track:2'
  },
  {
    id: '3',
    name: 'Test Song 3',
    artist: 'Test Artist 3',
    album: 'Test Album 3',
    uri: 'spotify:track:3'
  }
]

export const mockPlaylistResponse = {
  success: true,
  playlistId: 'mock-playlist-id',
  name: 'My Test Playlist'
}

// Setup mock fetch responses
export const setupMockFetch = () => {
  global.fetch.mockImplementation(url => {
    // Mock search endpoint
    if (url.includes('/search')) {
      return Promise.resolve({
        ok: true,
        status: 200,
        json: () =>
          Promise.resolve({
            tracks: {
              items: mockTracks
            }
          })
      })
    }

    // Mock create playlist endpoint
    if (url.includes('/playlists') && !url.includes('/tracks')) {
      return Promise.resolve({
        ok: true,
        status: 201,
        json: () =>
          Promise.resolve({
            id: mockPlaylistResponse.playlistId,
            name: mockPlaylistResponse.name
          })
      })
    }

    // Mock add tracks to playlist endpoint
    if (url.includes('/tracks')) {
      return Promise.resolve({
        ok: true,
        status: 201,
        json: () => Promise.resolve({ snapshot_id: 'mock-snapshot' })
      })
    }

    // Default
    return Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({})
    })
  })
}

// Mock auth service
vi.mock('../services/spotifyAuth', () => ({
  getAccessToken: vi.fn(() => {
    return Promise.resolve('mock-token')
  }),
  startAuthFlow: vi.fn()
}))
