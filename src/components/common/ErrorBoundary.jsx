import React from 'react'
import { Box, Typography, Button } from '@mui/material'
import { ReportProblem } from '@mui/icons-material'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="60vh"
          flexDirection="column"
          gap={3}
          p={3}
        >
          <ReportProblem sx={{ fontSize: 64, color: 'error.main' }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Oups ! Quelque chose s'est mal passé
          </Typography>
          <Typography variant="body1" color="textSecondary" align="center">
            Une erreur inattendue s'est produite. Veuillez rafraîchir la page ou réessayer plus tard.
          </Typography>
          <Button 
            variant="contained" 
            color="primary"
            onClick={() => window.location.reload()}
          >
            Rafraîchir la page
          </Button>
        </Box>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary