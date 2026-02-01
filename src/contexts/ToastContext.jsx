import { createContext, useContext, useState } from 'react'
import { Snackbar, Alert } from '@mui/material'

const ToastContext = createContext(null)

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info'
  })

  const showToast = (message, severity = 'info') => {
    setToast({ open: true, message, severity })
  }

  const showSuccess = message => showToast(message, 'success')
  const showError = message => showToast(message, 'error')

  const handleClose = () => {
    setToast(prev => ({ ...prev, open: false }))
  }

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError }}>
      {children}
      <Snackbar
        open={toast.open}
        autoHideDuration={6000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleClose} severity={toast.severity} sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}
