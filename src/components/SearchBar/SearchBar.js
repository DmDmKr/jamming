import React, { useState } from 'react'
import { Box, TextField, Button } from '@mui/material'

const SearchBar = ({ searchSpotify }) => {
  const [term, setTerm] = useState('')

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
    <Box display="flex" flexDirection="column" alignItems="center" gap={5}>
      <TextField
        variant="outlined"
        placeholder="Search Spotify"
        onChange={handleTermChange}
        onKeyDown={handleEnterKeyPress}
        value={term}
        sx={{
          width: '300px'
        }}
      />
      <Button onClick={handleSearch} variant="contained" disabled={!term} sx={{ width: '150px' }}>
        Search
      </Button>
    </Box>
  )
}

export default SearchBar
