import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './components/App'
import { ThemeProvider } from '@mui/material/styles'
import theme from './theme'
import { ToastProvider } from './contexts/ToastContext'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </React.StrictMode>
)
