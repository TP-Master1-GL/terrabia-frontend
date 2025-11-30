import React from 'react'
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Button
} from '@mui/material'
import {
  Add,
  Remove,
  Delete
} from '@mui/icons-material'

const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return
    if (newQuantity > item.product.quantity) {
      // Afficher un message d'erreur
      return
    }
    onUpdateQuantity(item.id, newQuantity)
  }

  const handleRemove = () => {
    onRemove(item.id)
  }

  const totalPrice = item.quantity * item.product.price

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <CardMedia
            component="img"
            sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
            image={item.product.images?.[0] || '/placeholder-product.jpg'}
            alt={item.product.name}
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {item.product.name}
            </Typography>
            
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Vendeur: {item.product.farmer?.name}
            </Typography>
            
            <Typography variant="body1" color="primary" fontWeight="bold">
              {item.product.price} FCFA / {item.product.unit}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small" 
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
              >
                <Remove />
              </IconButton>
              
              <TextField
                value={item.quantity}
                size="small"
                sx={{ width: 60 }}
                inputProps={{ 
                  style: { textAlign: 'center' },
                  min: 1,
                  max: item.product.quantity
                }}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
              />
              
              <IconButton 
                size="small" 
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= item.product.quantity}
              >
                <Add />
              </IconButton>
            </Box>
            
            <Typography variant="h6" color="primary" fontWeight="bold">
              {totalPrice} FCFA
            </Typography>
            
            <Button
              color="error"
              startIcon={<Delete />}
              onClick={handleRemove}
              size="small"
            >
              Supprimer
            </Button>
          </Box>
        </Box>
        
        {item.quantity === item.product.quantity && (
          <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
            Quantité maximale disponible
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export default CartItem