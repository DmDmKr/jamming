import { Box, TextField, Button, useTheme } from '@mui/material'

const SearchBar = ({ term, setTerm, searchSpotify, handleClear, isAuthenticated, isLoading }) => {
  const theme = useTheme()

  const handleTermChange = event => {
    setTerm(event.target.value)
  }

  const handleSearch = event => {
    event.preventDefault()
    const trimmedTerm = term.trim()
    if (trimmedTerm) {
      searchSpotify(trimmedTerm)
    }
  }

  const handleEnterKeyPress = event => {
    if (event.key === 'Enter') {
      handleSearch(event)
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      display="flex"
      flexDirection="column"
      width="100%"
      alignItems="center"
      gap={10}
      margin="0 auto"
      maxWidth={theme.spacing(150)}
      role="search"
    >
      <TextField
        variant="outlined"
        placeholder="Search Spotify"
        onChange={handleTermChange}
        onKeyDown={handleEnterKeyPress}
        value={term}
        fullWidth
        slotProps={{
          htmlInput: {
            'aria-label': 'Search for songs'
          }
        }}
      />
      <Box display="flex" width="100%" justifyContent="space-between">
        <Button
          type="submit"
          variant="contained"
          disabled={!term || isLoading}
          aria-label="Search for tracks"
        >
          {isLoading ? 'Loading...' : 'Search'}
        </Button>
        <Button
          onClick={handleClear}
          variant="outlined"
          aria-label="Clear search results and playlist"
        >
          Clear
        </Button>
      </Box>
    </Box>
  )
}

export default SearchBar
