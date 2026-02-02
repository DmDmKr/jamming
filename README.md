# Jamming - Spotify Playlist Creator

A React application that allows users to search the Spotify library, create custom playlists, and save them to their Spotify account.

## Features

- Secure OAuth 2.0 PKCE authentication flow
- Real-time search of Spotify's music library
- Create and customize playlists
- Add and remove tracks with immediate feedback
- Save playlists directly to your Spotify account
- Accessible UI with ARIA labels and keyboard navigation
- Responsive design for mobile and desktop

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- A Spotify account
- Spotify Developer App credentials

### 1. Get Spotify API Credentials

1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Log in with your Spotify account
3. Click "Create an App"
4. Fill in the app name and description
5. Once created, you'll see your **Client ID**
6. Click "Edit Settings" and add `http://127.0.0.1:3000/callback` to **Redirect URIs**
   - **Important**: Use `127.0.0.1` not `localhost` to avoid redirect URI mismatch errors
7. Save your settings

### 2. Find Your Spotify User ID

1. Go to your [Spotify Account](https://www.spotify.com/account/overview/)
2. Your User ID is listed in your account overview

### 3. Configure Environment Variables

1. Copy the example environment file:

   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in your credentials:
   ```
   VITE_SPOTIFY_CLIENT_ID=your_client_id_from_spotify_dashboard
   VITE_SPOTIFY_USER_ID=your_spotify_user_id
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:3000/
   ```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

The app will open at [http://localhost:3000](http://localhost:3000)

## How to Use

1. When you first search for a track, you'll be redirected to Spotify to authorize the app
2. After authorization, you'll be redirected back to the app
3. Search for tracks using the search bar
4. Click "+" to add tracks to your playlist
5. Name your playlist
6. Click "Save to Spotify" to save the playlist to your account

## Available Scripts

### `npm run dev`

Runs the app in development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run preview`

Previews the production build locally.

### `npm test`

Runs the test suite using Vitest.\
Tests run in watch mode by default during development.

## Security Note

**IMPORTANT**: Never commit your `.env` file to version control. It contains sensitive API credentials. The `.env` file is already included in `.gitignore`.

## Technologies Used

- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Material-UI v6** - Component library with accessibility support
- **Spotify Web API** - OAuth 2.0 PKCE authentication flow
- **Vitest** - Fast unit testing framework with React Testing Library

## Testing

The application includes integration tests covering key user workflows:

- **Search Flow**: Track search, result display, adding/removing tracks
- **Playlist Management**: Creating playlists, naming, saving to Spotify
- **Error Handling**: Network failures, authentication errors
- **Loading States**: UI feedback during asynchronous operations
- **Error Boundary**: Graceful handling of component crashes

Tests are located in `src/test/` with the following structure:

- `App.test.jsx` - Integration tests for main application workflows
- `ErrorBoundary.test.jsx` - Error boundary component tests
- `setup.js` - Test environment configuration
- `mocks.js` - Shared mock data and service mocks

Run tests with `npm test` to ensure application reliability.

## Architecture

- **Service Layer**: Modular API services (`spotifyAuth.js`, `spotifyAPI.js`)
- **Custom Hooks**: Centralized state management (`useSpotify`)
- **Context API**: Global toast notifications (`ToastContext`)
- **Error Boundary**: Graceful error handling for component crashes
- **Accessibility**: ARIA labels, semantic HTML, keyboard navigation

## License

This project is for educational purposes.
