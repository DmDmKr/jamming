import { Box, Typography, useTheme } from '@mui/material'
import TrackList from './TrackList'
import BoxWithMessage from './BoxWithMessage'

const SearchResults = ({ searchResults, onAdd }) => {
  const theme = useTheme()

  const showMessage = searchResults.length === 0

  return (
    <Box
      component="section"
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={5}
      color="aliceblue"
      aria-label="Search results"
    >
      <Typography
        variant="h2"
        component="h2"
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
        role="region"
        aria-live="polite"
      >
        {showMessage ? (
          <BoxWithMessage message="Please search for some tracks on Spotify!" />
        ) : (
          <TrackList tracks={searchResults} buttonType="search" onAdd={onAdd} />
        )}
      </Box>
    </Box>
  )
}

export default SearchResults
