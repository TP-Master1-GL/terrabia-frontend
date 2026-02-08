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
  Alert,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Chip,
  Stack,
  Fade,
  Zoom
} from '@mui/material'
import {
  ShoppingCart,
  ArrowBack,
  Payment,
  Delete,
  Add,
  Remove,
  LocalShipping,
  Security,
  Replay,
  ShoppingBag
} from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/apiService'
import { motion, AnimatePresence } from 'framer-motion'

// Composant pour un item du panier
const CartItem = ({ item, onUpdateQuantity, onRemove, updating }) => {
  return (
    <Card 
      elevation={0}
      sx={{ 
        mb: 2,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        '&:hover': {
          boxShadow: 2,
          borderColor: 'primary.main',
        },
        transition: 'all 0.3s ease',
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={3} sm={2}>
            <CardMedia
              component="img"
              height="80"
              image={item.product_image || '/api/placeholder/80/80'}
              alt={item.product_name}
              sx={{ 
                borderRadius: 1,
                objectFit: 'cover',
                backgroundColor: 'grey.100'
              }}
            />
          </Grid>
          
          <Grid item xs={9} sm={6}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              {item.product_name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              {item.product_unit && (
                <Chip 
                  label={item.product_unit} 
                  size="small" 
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText'
                  }} 
                />
              )}
              {item.product_category && (
                <Chip 
                  label={item.product_category} 
                  size="small" 
                  variant="outlined"
                  sx={{ height: 20, fontSize: '0.7rem' }}
                />
              )}
            </Stack>
            {item.farmer_name && (
              <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                Agriculteur: {item.farmer_name}
              </Typography>
            )}
          </Grid>
          
          <Grid item xs={6} sm={2}>
            <Typography variant="h6" color="primary" fontWeight={700}>
              {(item.quantity * parseFloat(item.product_price || 0)).toLocaleString()} FCFA
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {parseFloat(item.product_price || 0).toLocaleString()} FCFA/unité
            </Typography>
          </Grid>
          
          <Grid item xs={6} sm={2}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <IconButton 
                size="small" 
                onClick={() => onUpdateQuantity(item.id, Math.max(0, item.quantity - 1))}
                disabled={updating}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                <Remove fontSize="small" />
              </IconButton>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  minWidth: 40, 
                  textAlign: 'center',
                  fontWeight: 600
                }}
              >
                {item.quantity}
              </Typography>
              
              <IconButton 
                size="small"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                disabled={updating}
                sx={{ 
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.main',
                  }
                }}
              >
                <Add fontSize="small" />
              </IconButton>
              
              <IconButton 
                size="small" 
                onClick={() => onRemove(item.id)}
                disabled={updating}
                sx={{ 
                  ml: 1,
                  color: 'error.main',
                  '&:hover': {
                    bgcolor: 'error.light',
                  }
                }}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const Cart = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState('')
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const cartData = await apiService.getCart()
      setCartItems(cartData.items || [])
      setAnimate(true)
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
      navigate('/login', { state: { from: '/cart' } })
      return
    }
    navigate('/checkout')
  }

  const handleClearCart = async () => {
    try {
      setUpdating(true)
      await apiService.clearCart()
      setCartItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
      setError('Erreur lors de la vidange du panier')
    } finally {
      setUpdating(false)
    }
  }

  // Calcul des totaux
  const subtotal = cartItems.reduce((total, item) => 
    total + (item.quantity * parseFloat(item.product_price || 0)), 0
  )
  const shippingFee = cartItems.length > 0 ? 1500 : 0
  const total = subtotal + shippingFee

  const features = [
    { icon: <LocalShipping />, text: 'Livraison rapide' },
    { icon: <Security />, text: 'Paiement sécurisé' },
    { icon: <Replay />, text: 'Retour facile' }
  ]

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
            Chargement de votre panier...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box 
          textAlign="center" 
          py={8}
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ShoppingBag 
            sx={{ 
              fontSize: 120, 
              color: 'grey.300',
              mb: 3
            }} 
          />
          <Typography variant="h3" gutterBottom fontWeight={700} color="text.primary">
            Votre panier est vide
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 500, mx: 'auto' }}>
            Découvrez nos produits frais directement de nos agriculteurs locaux
          </Typography>
          <Button
            variant="contained"
            component={Link}
            to="/products"
            size="large"
            sx={{ 
              px: 6,
              py: 1.5,
              fontSize: '1.1rem',
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: 3
            }}
          >
            Découvrir nos produits
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
          sx={{ 
            mb: 2,
            textTransform: 'none',
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'primary.main'
            }
          }}
        >
          Continuer mes achats
        </Button>
        
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <ShoppingCart sx={{ fontSize: 40, color: 'primary.main' }} />
          <Box>
            <Typography variant="h3" component="h1" fontWeight={800}>
              Mon Panier
            </Typography>
            <Typography variant="h6" color="text.secondary">
              {cartItems.length} article{cartItems.length > 1 ? 's' : ''} • Total: {total.toLocaleString()} FCFA
            </Typography>
          </Box>
        </Box>
      </Box>

      {error && (
        <Zoom in={!!error}>
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              borderRadius: 2,
              boxShadow: 1
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        </Zoom>
      )}

      <Grid container spacing={4}>
        {/* Liste des articles */}
        <Grid item xs={12} lg={8}>
          <AnimatePresence>
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <CartItem
                  item={item}
                  onUpdateQuantity={handleUpdateQuantity}
                  onRemove={handleRemoveItem}
                  updating={updating}
                />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {/* Boutons d'action */}
          <Box display="flex" justifyContent="space-between" mt={3}>
            <Button
              variant="outlined"
              color="error"
              startIcon={<Delete />}
              onClick={handleClearCart}
              disabled={updating || cartItems.length === 0}
              sx={{ borderRadius: 2 }}
            >
              Vider le panier
            </Button>
            <Button
              variant="outlined"
              onClick={fetchCart}
              startIcon={<Replay />}
              disabled={updating}
              sx={{ borderRadius: 2 }}
            >
              Actualiser
            </Button>
          </Box>
        </Grid>

        {/* Récapitulatif */}
        <Grid item xs={12} lg={4}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 4, 
              borderRadius: 3,
              position: 'sticky',
              top: 100,
              bgcolor: 'background.paper',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Typography variant="h5" gutterBottom fontWeight={700} sx={{ mb: 3 }}>
              Récapitulatif
            </Typography>

            {/* Détails du prix */}
            <Box sx={{ mb: 3 }}>
              <Stack spacing={2}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body1" color="text.secondary">
                    Sous-total ({cartItems.length} articles)
                  </Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {subtotal.toLocaleString()} FCFA
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocalShipping fontSize="small" color="action" />
                    <Typography variant="body1" color="text.secondary">
                      Livraison
                    </Typography>
                  </Box>
                  <Typography variant="body1" fontWeight={600}>
                    {shippingFee.toLocaleString()} FCFA
                  </Typography>
                </Box>
                
                <Divider sx={{ my: 1 }} />
                
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={800}>
                    Total
                  </Typography>
                  <Typography variant="h4" color="primary" fontWeight={900}>
                    {total.toLocaleString()} FCFA
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Bouton de paiement */}
            <Button
              variant="contained"
              fullWidth
              size="large"
              startIcon={<Payment />}
              onClick={handleCheckout}
              disabled={updating}
              sx={{ 
                mb: 3,
                py: 2,
                fontSize: '1.1rem',
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 700,
                boxShadow: 3,
                '&:hover': {
                  boxShadow: 6,
                  transform: 'translateY(-2px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              {updating ? <CircularProgress size={24} /> : 'Procéder au paiement'}
            </Button>

            {/* Garanties */}
            <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                <Security fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
                Paiement 100% sécurisé
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Vos informations sont protégées par un cryptage SSL
              </Typography>
            </Box>

            {/* Fonctionnalités */}
            <Box sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                {features.map((feature, index) => (
                  <Grid item xs={4} key={index}>
                    <Box textAlign="center">
                      <Box
                        sx={{
                          display: 'inline-flex',
                          p: 1,
                          borderRadius: 2,
                          bgcolor: 'primary.light',
                          color: 'primary.contrastText',
                          mb: 1
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography variant="caption" display="block">
                        {feature.text}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default Cart