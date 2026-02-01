# Spotify Service Architecture

## Module Structure

```
src/
├── services/
│   ├── spotifyAuth.js    # OAuth/PKCE authentication & token management
│   └── spotifyAPI.js     # Spotify API calls (search, playlists)
├── utils/
│   └── httpClient.js     # Generic HTTP client with auth interceptor
└── hooks/
    └── useSpotify.js     # React hook consuming the services
```

## Module Responsibilities

### `services/spotifyAuth.js`

**Purpose**: OAuth authentication and token lifecycle management

**Exports**:

- `getAccessToken()` - Get current valid token or exchange code
- `startAuthFlow()` - Initiate PKCE authorization
- `isAuthenticated()` - Check if user has valid token
- `logout()` - Clear all auth data

**Key Features**:

- PKCE code generation (verifier + challenge)
- Token exchange with Spotify API
- Automatic token expiration handling
- Race condition prevention
- Clean URL state management

---

### `services/spotifyAPI.js`

**Purpose**: Spotify Web API operations

**Exports**:

- `searchTracks(query)` - Search for tracks
- `createPlaylist(name, description)` - Create new playlist
- `addTracksToPlaylist(playlistId, trackUris)` - Add tracks to playlist
- `savePlaylist(name, tracks)` - Complete playlist creation flow

**Key Features**:

- Data transformation (Spotify format → app format)
- Input validation
- Composed operations (create + add tracks)
- Clean error propagation

---

### `utils/httpClient.js`

**Purpose**: Centralized HTTP request handling

**Features**:

- Automatic token injection via interceptor
- 401 handling (expired sessions)
- Consistent error handling
- Base URL configuration
- GET/POST helper methods

**Pattern**: Interceptor pattern for cross-cutting concerns

---

## Usage Examples

### Direct Usage (Clean Architecture):

```javascript
import { getAccessToken, startAuthFlow } from '@/services/spotifyAuth'
import { searchTracks, savePlaylist } from '@/services/spotifyAPI'

// Search
const tracks = await searchTracks('Beatles')

// Save playlist
const result = await savePlaylist('My Playlist', tracks)
```

### In React Hook:

```javascript
// useSpotify.js
import { getAccessToken, startAuthFlow } from '../services/spotifyAuth'
import { searchTracks, savePlaylist } from '../services/spotifyAPI'

const searchSpotify = async term => {
  const token = await getAccessToken()
  if (!token) {
    await startAuthFlow()
    return
  }
  const tracks = await searchTracks(term)
  // ...
}
```

---
