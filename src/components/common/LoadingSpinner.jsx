import React from 'react'
import { Box, CircularProgress, Typography } from '@mui/material'

const LoadingSpinner = ({ message = "Chargement..." }) => {
  return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      flexDirection="column"
      gap={2}
      py={4}
    >
      <CircularProgress size={40} />
      <Typography variant="body1" color="textSecondary">
        {message}
      </Typography>
    </Box>
  )
}

export default LoadingSpinner