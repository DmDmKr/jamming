import React from 'react'
import { Box, TextField, Button, useTheme } from '@mui/material'

const SearchBar = ({ term, setTerm, searchSpotify, handleClear }) => {
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
      display="flex"
      flexDirection="column"
      width="100%"
      alignItems="center"
      gap={10}
      margin="0 auto"
      maxWidth={theme.spacing(150)}
    >
      <TextField
        variant="outlined"
        placeholder="Search Spotify"
        onChange={handleTermChange}
        onKeyDown={handleEnterKeyPress}
        value={term}
        fullWidth
      />
      <Box display="flex" width="100%" justifyContent="space-between">
        <Button onClick={handleSearch} variant="contained" disabled={!term}>
          Search
        </Button>
        <Button onClick={handleClear} variant="outlined">
          Clear
        </Button>
      </Box>
    </Box>
  )
}

export default SearchBar
