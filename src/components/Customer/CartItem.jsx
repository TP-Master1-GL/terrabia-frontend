// components/Customer/CartItem.js
import React from 'react'
import {
  Box,
  Typography,
  IconButton,
  TextField,
  Card,
  CardContent,
  CardMedia,
  Button,
  CircularProgress
} from '@mui/material'
import {
  Add,
  Remove,
  Delete
} from '@mui/icons-material'

const CartItem = ({ item, onUpdateQuantity, onRemove, updating }) => {
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return
    if (newQuantity > item.product?.stock) {
      // Afficher un message d'erreur
      return
    }
    onUpdateQuantity(item.id, newQuantity)
  }

  const handleRemove = () => {
    onRemove(item.id)
  }

  const totalPrice = item.quantity * parseFloat(item.product_price || 0)

  return (
    <Card sx={{ mb: 2, opacity: updating ? 0.6 : 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <CardMedia
            component="img"
            sx={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 1 }}
            image={item.product?.images?.[0]?.image || '/placeholder-product.jpg'}
            alt={item.product_name}
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="h3" gutterBottom>
              {item.product_name}
            </Typography>
            
            <Typography variant="body2" color="textSecondary" gutterBottom>
              Vendeur: {item.product?.farmer?.first_name} {item.product?.farmer?.last_name}
            </Typography>
            
            <Typography variant="body1" color="primary" fontWeight="bold">
              {parseFloat(item.product_price || 0).toLocaleString()} FCFA / {item.product?.unit}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <IconButton 
                size="small" 
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1 || updating}
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
                  max: item.product?.stock
                }}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                disabled={updating}
              />
              
              <IconButton 
                size="small" 
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= item.product?.stock || updating}
              >
                <Add />
              </IconButton>
            </Box>
            
            <Typography variant="h6" color="primary" fontWeight="bold">
              {totalPrice.toLocaleString()} FCFA
            </Typography>
            
            <Button
              color="error"
              startIcon={updating ? <CircularProgress size={16} /> : <Delete />}
              onClick={handleRemove}
              size="small"
              disabled={updating}
            >
              {updating ? '' : 'Supprimer'}
            </Button>
          </Box>
        </Box>
        
        {item.quantity === item.product?.stock && (
          <Typography variant="caption" color="warning.main" sx={{ mt: 1, display: 'block' }}>
            Quantité maximale disponible
          </Typography>
        )}
        
        {updating && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <CircularProgress size={16} />
            <Typography variant="caption" color="textSecondary">
              Mise à jour...
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export default CartItem