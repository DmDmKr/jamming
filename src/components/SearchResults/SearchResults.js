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
    <Box
      backgroundColor="rgba(1, 12, 63, 0.7)"
      display="flex"
      alignItems="center"
      flexDirection="column"
      mr={100}
      color="aliceblue"
      height={theme.spacing(250)}
      width={theme.spacing(300)}
      sx={{
        overflowY: 'auto'
      }}
    >
      <Typography variant="h2" mt={8} fontSize="2rem">
        Results
      </Typography>
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
  )
}

export default SearchResults
