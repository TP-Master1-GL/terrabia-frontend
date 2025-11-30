// components/Customer/Cart.js
import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Button,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  ShoppingCart,
  ArrowBack,
  Payment
} from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import CartItem from '../../components/Customer/CartItem'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/apiService'

const Cart = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const cartData = await apiService.getCart()
      setCartItems(cartData.items || [])
    } catch (error) {
      console.error('Error fetching cart:', error)
      setError('Erreur lors du chargement du panier')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    try {
      setUpdating(true)
      if (newQuantity === 0) {
        await handleRemoveItem(itemId)
        return
      }

      await apiService.updateCartItem(itemId, newQuantity)
      
      // Mettre à jour localement
      setCartItems(prev => 
        prev.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      )
    } catch (error) {
      console.error('Error updating cart item:', error)
      setError('Erreur lors de la mise à jour de la quantité')
    } finally {
      setUpdating(false)
    }
  }

  const handleRemoveItem = async (itemId) => {
    try {
      setUpdating(true)
      await apiService.removeFromCart(itemId)
      
      // Mettre à jour localement
      setCartItems(prev => prev.filter(item => item.id !== itemId))
    } catch (error) {
      console.error('Error removing cart item:', error)
      setError('Erreur lors de la suppression de l\'article')
    } finally {
      setUpdating(false)
    }
  }

  const handleCheckout = () => {
    if (!user) {
      navigate('/login')
      return
    }
    navigate('/checkout')
  }

  // Calcul des totaux
  const subtotal = cartItems.reduce((total, item) => 
    total + (item.quantity * parseFloat(item.product_price || 0)), 0
  )
  const shippingFee = 1500
  const total = subtotal + shippingFee

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" py={8}>
          <CircularProgress />
        </Box>
      </Container>
    )
  }

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

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {cartItems.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveItem}
                updating={updating}
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
                <Typography variant="body2">{subtotal.toLocaleString()} FCFA</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">Frais de livraison</Typography>
                <Typography variant="body2">{shippingFee.toLocaleString()} FCFA</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" color="primary" fontWeight="bold">
                  {total.toLocaleString()} FCFA
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Payment />}
              onClick={handleCheckout}
              sx={{ mb: 2 }}
              disabled={updating}
            >
              {updating ? <CircularProgress size={24} /> : 'Procéder au paiement'}
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