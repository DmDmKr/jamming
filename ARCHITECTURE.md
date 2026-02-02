# Spotify Service Architecture

## Module Structure

```
src/
├── services/
│   ├── spotifyAuth.js    # OAuth/PKCE authentication & token management
│   └── spotifyAPI.js     # Spotify API calls (search, playlists)
├── contexts/
│   ├── AuthContext.jsx   # Global authentication state & token expiry
│   └── ToastContext.jsx  # Global notification system
├── hooks/
│   ├── useAuth.js        # Authentication hook (from AuthContext)
│   ├── useSearch.js      # Search functionality with AbortController
│   └── usePlaylist.js    # Playlist management
└── components/
    └── ...               # React components
```

## Module Responsibilities

### `contexts/AuthContext.jsx`

**Purpose**: Centralized authentication state management

**Exports**:

- `<AuthProvider>` - Context provider component
- `useAuth()` - Hook to access auth state

**Features**:

- Global authentication state
- Token expiry monitoring with automatic logout
- Proper cleanup (no memory leaks)
- Single source of truth for auth

**Key Pattern**: React Context API for global state

---

### `services/spotifyAuth.js`

**Purpose**: OAuth authentication and token lifecycle management

**Exports**:

- `getAccessToken()` - Get current valid token or exchange code
- `startAuthFlow()` - Initiate PKCE authorization

**Key Features**:

- PKCE code generation (verifier + challenge)
- Token exchange with Spotify API
- Token storage in localStorage
- Clean URL state management
- Race condition prevention

---

### `services/spotifyAPI.js`

**Purpose**: Spotify Web API operations

**Exports**:

- `searchTracks(query, signal)` - Search for tracks with abort support
- `createPlaylist(name, description)` - Create new playlist
- `addTracksToPlaylist(playlistId, trackUris)` - Add tracks to playlist
- `savePlaylist(name, tracks)` - Complete playlist creation flow

**Key Features**:

- Data transformation (Spotify format → app format)
- AbortController support for cancellable requests
- Input validation
- Composed operations (create + add tracks)
- Clean error propagation

---

### `hooks/useSearch.js`

**Purpose**: Search state and operations

**Features**:

- Search results state management
- AbortController for request cancellation (prevents race conditions)
- Automatic auth state updates on errors
- Loading state management
- Result manipulation (add/remove tracks)

**Key Pattern**: Single Responsibility - only handles search

---

### `hooks/usePlaylist.js`

**Purpose**: Playlist state and operations

**Features**:

- Playlist tracks state management
- Add/remove track operations
- Save playlist to Spotify
- Loading state for async operations
- Validation (name required, non-empty playlist)

**Key Pattern**: Single Responsibility - only handles playlist

---

### `contexts/ToastContext.jsx`

**Purpose**: Global notification system

**Exports**:

- `<ToastProvider>` - Context provider
- `useToast()` - Hook with `showSuccess()`, `showError()` methods

**Key Pattern**: Context API for cross-cutting UI concerns

---

## Usage Examples

### Using Hooks in Components:

```javascript
// App.jsx
import { useAuth } from '../contexts/AuthContext'
import useSearch from '../hooks/useSearch'
import usePlaylist from '../hooks/usePlaylist'

const App = () => {
  const { isAuthenticated } = useAuth()
  const { searchResults, search, isLoading } = useSearch()
  const { playlistTracks, addTrack, savePlaylist } = usePlaylist()

  // Components automatically handle auth state
}
```

### Direct Service Usage:

```javascript
import { searchTracks, savePlaylist } from '../services/spotifyAPI'

// With AbortController for cancellation
const controller = new AbortController()
const tracks = await searchTracks('Beatles', controller.signal)

// Save playlist
const result = await savePlaylist('My Playlist', tracks)
```

---

## Architecture Patterns

### Single Responsibility Hooks

Each hook manages one domain:

- `useAuth` → Authentication only
- `useSearch` → Search only
- `usePlaylist` → Playlist only

**Benefits**: Testable, reusable, maintainable

### Context for Global State

Auth and Toast use Context API:

- Avoids prop drilling
- Single source of truth
- Hooks automatically consume context

### AbortController Pattern

Search requests are cancellable:

- Prevents race conditions
- Handles rapid user input
- Cleans up on unmount

### Memory Leak Prevention

- Token expiry uses useEffect cleanup
- AbortController cancelled on new search
- Timeouts cleared on unmount
