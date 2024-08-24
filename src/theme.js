import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  spacing: 2,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          padding: '1rem 2rem',
          backgroundColor: '#0b0ec4',
          color: '#ffffff',
          fontWeight: 600,
          transition: 'background-color 0.5s',
          '&:hover': {
            backgroundColor: 'rgba(108, 65, 233, 0.7)',
            cursor: 'pointer'
          },
          '&:disabled': {
            cursor: 'not-allowed',
            pointerEvents: 'auto',
            backgroundColor: '#999999',
            color: '#ffffff'
          }
        },
        outlined: {
          '&:hover': {
            backgroundColor: 'rgba(108, 65, 233, 0.1)', // Light background on hover
            cursor: 'pointer'
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          borderRadius: '3px',
          fontSize: '1rem',
          '& .MuiOutlinedInput-input': {
            '&:focus': {
              outline: 'none'
            }
          },
          '& .MuiInputBase-input::placeholder': {
            textAlign: 'center'
          }
        }
      }
    }
  }
})

export default theme
