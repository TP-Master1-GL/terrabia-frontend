import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Divider
} from '@mui/material'
import {
  ShoppingCart,
  ArrowBack,
  Payment
} from '@mui/icons-material'
import { Link } from 'react-router-dom'
import CartItem from '../../components/Customer/CartItem'

const Cart = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      quantity: 2,
      product: {
        id: 1,
        name: 'Tomates Fraîches',
        price: 1200,
        quantity: 50,
        unit: 'kg',
        images: ['/placeholder-product.jpg'],
        farmer: { name: 'Jean Dupont' }
      }
    }
    // Ajouter plus d'articles...
  ])

  const handleUpdateQuantity = (itemId, newQuantity) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const handleRemoveItem = (itemId) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  const subtotal = cartItems.reduce((total, item) => total + (item.quantity * item.product.price), 0)
  const shippingFee = 1500
  const total = subtotal + shippingFee

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box textAlign="center" py={8}>
          <ShoppingCart sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            Votre panier est vide
          </Typography>
          <Typography variant="body1" color="textSecondary" sx={{ mb: 3 }}>
            Découvrez nos produits frais et ajoutez-les à votre panier
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/products"
            size="large"
          >
            Découvrir les produits
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          component={Link}
          to="/products"
          sx={{ mb: 2 }}
        >
          Continuer mes achats
        </Button>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Mon Panier
        </Typography>
        <Typography variant="body1" color="textSecondary">
          {cartItems.length} article{cartItems.length > 1 ? 's' : ''} dans votre panier
        </Typography>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
              />
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
            <Typography variant="h6" gutterBottom>
              Récapitulatif de la commande
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Sous-total</Typography>
                <Typography variant="body2">{subtotal} FCFA</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Frais de livraison</Typography>
                <Typography variant="body2">{shippingFee} FCFA</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {total} FCFA
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Payment />}
              component={Link}
              to="/checkout"
              sx={{ mb: 2 }}
            >
              Procéder au paiement
            </Button>

            <Typography variant="caption" color="textSecondary" display="block" textAlign="center">
              Livraison estimée sous 2-3 jours ouvrés
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Cart