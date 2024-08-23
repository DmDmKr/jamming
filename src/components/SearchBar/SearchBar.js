import React, { useState } from 'react'
import { Box, TextField, Button, useTheme } from '@mui/material'

const SearchBar = ({ searchSpotify }) => {
  const [term, setTerm] = useState('')
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
    <Box display="flex" flexDirection="column" alignItems="center" gap={20}>
      <TextField
        variant="outlined"
        placeholder="Search Spotify"
        onChange={handleTermChange}
        onKeyDown={handleEnterKeyPress}
        value={term}
        sx={{ width: theme.spacing(150) }}
      />
      <Button
        onClick={handleSearch}
        variant="contained"
        disabled={!term}
        sx={{ width: theme.spacing(75) }}
      >
        Search
      </Button>
    </Box>
  )
}

export default SearchBar
