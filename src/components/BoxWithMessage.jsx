import { Box, useTheme } from '@mui/material'

const BoxWithMessage = ({ message }) => {
  const theme = useTheme()

  return (
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
  )
}

export default BoxWithMessage
