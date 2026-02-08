// src/pages/Customer/Checkout.jsx
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
  TextField,
  FormControlLabel,
  Checkbox,
  Stepper,
  Step,
  StepLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  InputAdornment,
  Avatar,
  Chip,
  IconButton,
  Fade,
  Zoom
} from '@mui/material'
import {
  ArrowBack,
  Payment,
  CreditCard,
  AccountBalance,
  QrCode,
  LocalShipping,
  LocationOn,
  Person,
  Email,
  Phone,
  Lock,
  CheckCircle
} from '@mui/icons-material'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/apiService'
import { motion } from 'framer-motion'

const steps = ['Panier', 'Livraison', 'Paiement', 'Confirmation']

const Checkout = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [orderId, setOrderId] = useState(null)

  // États du formulaire
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    deliveryInstructions: '',
    paymentMethod: 'cash',
    saveInfo: true
  })

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { from: '/checkout' } })
      return
    }
    fetchCart()
  }, [user, navigate])

  const fetchCart = async () => {
    try {
      setLoading(true)
      const cartData = await apiService.getCart()
      setCartItems(cartData.items || [])
      
      // Pré-remplir avec les infos utilisateur
      if (user) {
        setFormData(prev => ({
          ...prev,
          firstName: user.first_name || '',
          lastName: user.last_name || '',
          email: user.email || '',
          phone: user.phone || ''
        }))
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      setError('Erreur lors du chargement du panier')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleNext = () => {
    // Validation des étapes
    if (activeStep === 1) {
      if (!formData.address || !formData.city || !formData.phone) {
        setError('Veuillez remplir tous les champs obligatoires')
        return
      }
    }
    setActiveStep((prevStep) => prevStep + 1)
    setError('')
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
    setError('')
  }

  const handleSubmitOrder = async () => {
    try {
      setProcessing(true)
      setError('')
      
      // 1. Vérifier que le panier n'est pas vide
      if (cartItems.length === 0) {
        throw new Error('Votre panier est vide')
      }
      
      // 2. Formater l'adresse complète selon le format attendu par Django
      const fullAddress = `${formData.address}, ${formData.city}${formData.postalCode ? ' ' + formData.postalCode : ''}`.trim()
      
      // 3. Préparer les notes avec toutes les informations
      const notes = [
        `Nom: ${formData.firstName} ${formData.lastName}`,
        `Téléphone: ${formData.phone}`,
        `Email: ${formData.email}`,
        `Paiement: ${paymentMethods.find(m => m.value === formData.paymentMethod)?.label}`,
        `Instructions: ${formData.deliveryInstructions || 'Aucune'}`
      ].join('\n')
      
      // 4. Préparer les données de commande selon le format Django
      // D'après votre script Python, le backend attend:
      // - shipping_address (string)
      // - delivery_fee (number)
      // - notes (string)
      const orderData = {
        shipping_address: fullAddress,
        delivery_fee: shippingFee / 100, // Convertir FCFA en unités si nécessaire
        notes: notes
        // Le backend va automatiquement utiliser les items du panier de l'utilisateur
      }
      
      console.log('📤 Envoi de la commande:', orderData)
      
      // 5. Envoyer la commande
      const order = await apiService.createOrder(orderData)
      
      console.log('✅ Commande créée:', order)
      
      // 6. Sauvegarder l'ID de commande pour l'affichage
      setOrderId(order.id || order.order_number)
      
      // 7. Essayer de vider le panier (mais continuer même en cas d'erreur)
      try {
        await apiService.clearCart()
        console.log('🛒 Panier vidé')
      } catch (cartError) {
        console.warn('⚠️ Erreur lors du vidage du panier, mais la commande est créée:', cartError)
        // Ne pas bloquer le processus, juste afficher un warning
      }
      
      // 8. Passer à l'étape de confirmation
      setActiveStep(3)
      setSuccess('Commande passée avec succès!')
      
    } catch (error) {
      console.error('❌ Erreur lors de la création de la commande:', error)
      
      let errorMessage = 'Erreur lors de la création de la commande'
      if (error.message.includes('panier est vide')) {
        errorMessage = 'Votre panier est vide. Veuillez ajouter des produits avant de commander.'
      } else if (error.response?.data) {
        // Extraire les détails d'erreur de la réponse Django
        const djangoError = error.response.data
        if (djangoError.detail) {
          errorMessage = djangoError.detail
        } else if (typeof djangoError === 'object') {
          errorMessage = Object.entries(djangoError)
            .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
            .join('; ')
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      setError(errorMessage)
    } finally {
      setProcessing(false)
    }
  }

  // Calcul des totaux
  const subtotal = cartItems.reduce((total, item) => 
    total + (item.quantity * parseFloat(item.product_price || 0)), 0
  )
  const shippingFee = cartItems.length > 0 ? 1500 : 0
  const total = subtotal + shippingFee

  const paymentMethods = [
    { value: 'cash', label: 'Paiement à la livraison', icon: <LocalShipping /> },
    { value: 'mobile_money', label: 'Mobile Money', icon: <AccountBalance /> },
    { value: 'wave', label: 'Wave', icon: <QrCode /> },
    { value: 'card', label: 'Carte bancaire', icon: <CreditCard /> }
  ]

  // Fonction pour vider le panier manuellement
  const clearCartManually = async () => {
    try {
      const cartData = await apiService.getCart()
      const items = cartData.items || []
      
      for (const item of items) {
        await apiService.removeFromCart(item.id)
      }
      
      return { success: true, message: 'Panier vidé manuellement' }
    } catch (error) {
      console.error('Erreur lors du vidage manuel du panier:', error)
      return { success: false, message: error.message }
    }
  }

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
            Préparation de votre commande...
          </Typography>
        </Box>
      </Container>
    )
  }

  if (cartItems.length === 0 && activeStep < 3) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box textAlign="center" py={8}>
          <Alert severity="info" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
            Votre panier est vide
          </Alert>
          <Button
            variant="contained"
            component={Link}
            to="/products"
            size="large"
          >
            Ajouter des produits
          </Button>
        </Box>
      </Container>
    )
  }

  const renderStepContent = (step) => {
    switch (step) {
      case 0: // Panier
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Récapitulatif de votre panier
            </Typography>
            {cartItems.map((item, index) => (
              <Paper key={item.id} sx={{ p: 2, mb: 2, borderRadius: 2 }}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item xs={2}>
                    <Avatar
                      variant="rounded"
                      src={item.product_image}
                      alt={item.product_name}
                      sx={{ width: 60, height: 60 }}
                    />
                  </Grid>
                  <Grid item xs={5}>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {item.product_name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.farmer_name || 'Producteur local'}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Typography variant="body2">
                      Qté: {item.quantity}
                    </Typography>
                  </Grid>
                  <Grid item xs={3}>
                    <Typography variant="subtitle1" fontWeight={700} textAlign="right">
                      {(item.quantity * item.product_price).toLocaleString()} FCFA
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>
            ))}
            
            <Paper sx={{ p: 3, mt: 3, borderRadius: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">Sous-total:</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body1" fontWeight={600}>
                    {subtotal.toLocaleString()} FCFA
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">Livraison:</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="body1" fontWeight={600}>
                    {shippingFee.toLocaleString()} FCFA
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="h6">Total:</Typography>
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Typography variant="h5" color="primary" fontWeight={800}>
                    {total.toLocaleString()} FCFA
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Box>
        )

      case 1: // Livraison
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
              Informations de livraison
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Prénom *"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                  error={!formData.firstName && activeStep >= 1}
                  helperText={!formData.firstName && activeStep >= 1 ? "Champ requis" : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Nom *"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  required
                  error={!formData.lastName && activeStep >= 1}
                  helperText={!formData.lastName && activeStep >= 1 ? "Champ requis" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  error={!formData.email && activeStep >= 1}
                  helperText={!formData.email && activeStep >= 1 ? "Champ requis" : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Téléphone *"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  required
                  error={!formData.phone && activeStep >= 1}
                  helperText={!formData.phone && activeStep >= 1 ? "Champ requis" : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Adresse *"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  multiline
                  rows={2}
                  error={!formData.address && activeStep >= 1}
                  helperText={!formData.address && activeStep >= 1 ? "Champ requis" : ""}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                  placeholder="Numéro et rue"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Ville *"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  error={!formData.city && activeStep >= 1}
                  helperText={!formData.city && activeStep >= 1 ? "Champ requis" : ""}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Code postal"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Instructions de livraison"
                  name="deliveryInstructions"
                  value={formData.deliveryInstructions}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  placeholder="Ex: Appartement au 2ème étage, sonner à la porte rouge..."
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="saveInfo"
                      checked={formData.saveInfo}
                      onChange={handleInputChange}
                      color="primary"
                    />
                  }
                  label="Enregistrer ces informations pour mes prochaines commandes"
                />
              </Grid>
            </Grid>
          </Box>
        )

      case 2: // Paiement
        return (
          <Box>
            <Typography variant="h6" gutterBottom fontWeight={600} sx={{ mb: 3 }}>
              Méthode de paiement
            </Typography>
            
            <FormControl component="fieldset" fullWidth>
              <RadioGroup
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleInputChange}
              >
                <Grid container spacing={2}>
                  {paymentMethods.map((method) => (
                    <Grid item xs={12} key={method.value}>
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          border: '2px solid',
                          borderColor: formData.paymentMethod === method.value 
                            ? 'primary.main' 
                            : 'divider',
                          cursor: 'pointer',
                          '&:hover': {
                            borderColor: 'primary.light',
                          }
                        }}
                        onClick={() => setFormData(prev => ({ 
                          ...prev, 
                          paymentMethod: method.value 
                        }))}
                      >
                        <Box display="flex" alignItems="center">
                          <Radio
                            value={method.value}
                            checked={formData.paymentMethod === method.value}
                            sx={{ mr: 2 }}
                          />
                          <Box sx={{ mr: 2, color: 'primary.main' }}>
                            {method.icon}
                          </Box>
                          <Typography variant="body1" fontWeight={600}>
                            {method.label}
                          </Typography>
                        </Box>
                        
                        {method.value === 'cash' && (
                          <Box sx={{ ml: 6, mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Paiement en espèces à la réception de votre commande
                            </Typography>
                          </Box>
                        )}
                        
                        {method.value === 'mobile_money' && (
                          <Box sx={{ ml: 6, mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Orange Money, Free Money, Wave acceptés
                            </Typography>
                          </Box>
                        )}
                        
                        {method.value === 'card' && (
                          <Box sx={{ ml: 6, mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">
                              Cartes Visa, Mastercard et autres acceptées
                            </Typography>
                          </Box>
                        )}
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              </RadioGroup>
            </FormControl>

            {/* Résumé de la commande */}
            <Paper sx={{ p: 3, mt: 4, borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Résumé de la commande
              </Typography>
              <Box sx={{ mt: 2 }}>
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Articles ({cartItems.length})
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body2">
                      {subtotal.toLocaleString()} FCFA
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Livraison
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="body2">
                      {shippingFee.toLocaleString()} FCFA
                    </Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Divider sx={{ my: 1 }} />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body1" fontWeight={600}>
                      Total
                    </Typography>
                  </Grid>
                  <Grid item xs={6} textAlign="right">
                    <Typography variant="h6" color="primary" fontWeight={800}>
                      {total.toLocaleString()} FCFA
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            </Paper>

            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', color: 'success.main' }}>
              <Lock fontSize="small" sx={{ mr: 1 }} />
              <Typography variant="caption">
                Vos informations sont sécurisées
              </Typography>
            </Box>
          </Box>
        )

      case 3: // Confirmation
        return (
          <Box textAlign="center" py={4}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            >
              <CheckCircle sx={{ fontSize: 100, color: 'success.main', mb: 3 }} />
            </motion.div>
            
            <Typography variant="h3" gutterBottom fontWeight={800} color="success.main">
              Commande confirmée !
            </Typography>
            
            <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600, mx: 'auto' }}>
              Merci pour votre commande. Vous recevrez un SMS de confirmation avec les détails de livraison.
            </Typography>
            
            <Paper sx={{ p: 3, mb: 4, borderRadius: 2, maxWidth: 500, mx: 'auto' }}>
              <Typography variant="body1" gutterBottom>
                Numéro de commande: <strong>#{orderId || 'En attente'}</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                Client: <strong>{formData.firstName} {formData.lastName}</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                Livraison: <strong>{formData.address}, {formData.city}</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                Téléphone: <strong>{formData.phone}</strong>
              </Typography>
              <Typography variant="body1" gutterBottom>
                Montant total: <strong>{total.toLocaleString()} FCFA</strong>
              </Typography>
              <Typography variant="body1">
                Mode de paiement: <strong>
                  {paymentMethods.find(m => m.value === formData.paymentMethod)?.label}
                </strong>
              </Typography>
            </Paper>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3, maxWidth: 500, mx: 'auto' }}>
              ⏱️ Livraison prévue sous 24-48h
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                component={Link}
                to="/orders"
                size="large"
                sx={{ px: 4 }}
              >
                Voir mes commandes
              </Button>
              <Button
                variant="outlined"
                component={Link}
                to="/products"
                size="large"
              >
                Continuer mes achats
              </Button>
            </Box>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Barre de navigation */}
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBack />}
          component={Link}
          to="/cart"
          sx={{ mb: 2 }}
          disabled={activeStep === 3}
        >
          Retour au panier
        </Button>
        
        <Typography variant="h3" component="h1" fontWeight={800} gutterBottom>
          {activeStep === 3 ? 'Commande confirmée' : 'Finaliser ma commande'}
        </Typography>
        
        {activeStep < 3 && (
          <Typography variant="h6" color="text.secondary">
            Étape {activeStep + 1} sur {steps.length - 1}
          </Typography>
        )}
      </Box>

      {/* Stepper */}
      {activeStep < 3 && (
        <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.slice(0, 3).map((label, index) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Paper>
      )}

      {/* Messages d'erreur/succès */}
      {error && (
        <Zoom in={!!error}>
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 2 }} 
            onClose={() => setError('')}
            action={
              error.includes('panier est vide') && (
                <Button 
                  color="inherit" 
                  size="small" 
                  onClick={() => navigate('/products')}
                >
                  Ajouter des produits
                </Button>
              )
            }
          >
            {error}
          </Alert>
        </Zoom>
      )}
      
      {success && (
        <Zoom in={!!success}>
          <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
            {success}
          </Alert>
        </Zoom>
      )}

      {/* Contenu de l'étape */}
      <motion.div
        key={activeStep}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Paper sx={{ p: 4, borderRadius: 3 }}>
          {renderStepContent(activeStep)}
        </Paper>
      </motion.div>

      {/* Boutons de navigation */}
      {activeStep < 3 && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            onClick={handleBack}
            disabled={activeStep === 0 || processing}
            sx={{ px: 4 }}
          >
            Retour
          </Button>
          
          <Button
            variant="contained"
            onClick={activeStep === 2 ? handleSubmitOrder : handleNext}
            disabled={processing}
            sx={{ px: 6 }}
            size="large"
            startIcon={processing ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {processing ? (
              'Traitement...'
            ) : activeStep === 2 ? (
              'Confirmer la commande'
            ) : (
              'Continuer'
            )}
          </Button>
        </Box>
      )}
      
      {/* Bouton de débogage pour vider le panier */}
      {process.env.NODE_ENV === 'development' && activeStep === 2 && (
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Button
            variant="text"
            size="small"
            color="secondary"
            onClick={clearCartManually}
          >
            [DEV] Vider panier manuellement
          </Button>
        </Box>
      )}
    </Container>
  )
}

export default Checkout