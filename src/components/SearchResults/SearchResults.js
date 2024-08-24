import React from 'react'
import { Box, Typography, useTheme } from '@mui/material'
import TrackList from '../Tracklist/Tracklist'

const SearchResults = ({ searchResults, error, onAdd }) => {
  const theme = useTheme()
  const getMessage = () => {
    if (error) {
      return error
    }
    if (searchResults.length === 0) {
      return 'Please search for some tracks on Spotify!'
    }
    return null
  }

  const message = getMessage()

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={5} color="aliceblue">
      <Typography
        variant="h2"
        fontSize="2rem"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '4rem'
        }}
      >
        Results
      </Typography>
      <Box
        backgroundColor="rgba(1, 12, 63, 0.7)"
        display="flex"
        alignItems="center"
        flexDirection="column"
        height={theme.spacing(250)}
        width="100%"
        sx={{
          overflowY: 'auto'
        }}
      >
        {message ? (
          <Box
            mt={theme.spacing(20)}
            mb={theme.spacing(20)}
            fontSize="large"
            textAlign="center"
            display="flex"
            flex={1}
            alignItems="center"
            justifyContent="center"
          >
            {message}
          </Box>
        ) : (
          <TrackList tracks={searchResults} buttonType="search" onAdd={onAdd} />
        )}
      </Box>
    </Box>
  )
}

export default SearchResults
