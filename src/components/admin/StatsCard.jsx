import React from 'react'
import {
  Card,
  CardContent,
  Typography,
  Box
} from '@mui/material'
import { TrendingUp, TrendingDown } from '@mui/icons-material'

const StatsCard = ({ title, value, change, icon, color = 'primary' }) => {
  const isPositive = change >= 0
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="textSecondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="bold">
              {value}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <ChangeIcon 
                sx={{ 
                  fontSize: 16, 
                  color: isPositive ? 'success.main' : 'error.main',
                  mr: 0.5
                }} 
              />
              <Typography 
                variant="body2" 
                sx={{ color: isPositive ? 'success.main' : 'error.main' }}
              >
                {isPositive ? '+' : ''}{change}%
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                vs mois dernier
              </Typography>
            </Box>
          </Box>
          <Box
            sx={{
              backgroundColor: `${color}.light`,
              color: `${color}.main`,
              borderRadius: '50%',
              width: 60,
              height: 60,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default StatsCard