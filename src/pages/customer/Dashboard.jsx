// components/Customer/CustomerDashboard.js
import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material'
import {
  Person,
  ShoppingBag,
  Favorite,
  Settings,
  LocalShipping,
  CheckCircle,
  Schedule
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/apiService'

const CustomerDashboard = () => {
  const { user, updateUser } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [orders, setOrders] = useState([])
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState({ orders: false, favorites: false, profile: false })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    if (user) {
      if (activeTab === 1) fetchOrders()
      if (activeTab === 2) fetchFavorites()
    }
  }, [user, activeTab])

  const fetchOrders = async () => {
    try {
      setLoading(prev => ({ ...prev, orders: true }))
      const ordersData = await apiService.getOrders()
      setOrders(ordersData)
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError('Erreur lors du chargement des commandes')
    } finally {
      setLoading(prev => ({ ...prev, orders: false }))
    }
  }

  const fetchFavorites = async () => {
    try {
      setLoading(prev => ({ ...prev, favorites: true }))
      const favoritesData = await apiService.getFavorites()
      setFavorites(favoritesData)
    } catch (error) {
      console.error('Error fetching favorites:', error)
      setError('Erreur lors du chargement des favoris')
    } finally {
      setLoading(prev => ({ ...prev, favorites: false }))
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setError('')
    setSuccess('')
  }

  const handleUpdateProfile = async (userData) => {
    try {
      setLoading(prev => ({ ...prev, profile: true }))
      const updatedUser = await apiService.updateProfile(userData)
      updateUser(updatedUser)
      setSuccess('Profil mis à jour avec succès')
    } catch (error) {
      console.error('Error updating profile:', error)
      setError('Erreur lors de la mise à jour du profil')
    } finally {
      setLoading(prev => ({ ...prev, profile: false }))
    }
  }

  const handleToggleFavorite = async (productId) => {
    try {
      await apiService.toggleFavorite(productId)
      // Recharger les favoris
      if (activeTab === 2) {
        fetchFavorites()
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      setError('Erreur lors de la modification des favoris')
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'default',
      confirmed: 'primary',
      preparing: 'secondary',
      ready: 'warning',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'error'
    }
    return colors[status] || 'default'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      preparing: 'En préparation',
      ready: 'Prête',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    }
    return texts[status] || status
  }

  // Calcul des statistiques
  const userStats = [
    { label: 'Commandes', value: orders.length.toString() },
    { label: 'Produits Favoris', value: favorites.length.toString() },
    { 
      label: 'Dépenses Totales', 
      value: `${orders.reduce((total, order) => total + parseFloat(order.total_amount || 0), 0).toLocaleString()} FCFA`
    }
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Mon Compte
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bienvenue, {user?.first_name} {user?.last_name} ! Gérez vos informations et suivez vos commandes.
        </Typography>
      </Box>

      {(error || success) && (
        <Alert severity={error ? 'error' : 'success'} sx={{ mb: 3 }}>
          {error || success}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Person sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6">{user?.first_name} {user?.last_name}</Typography>
              <Typography variant="body2" color="textSecondary">{user?.email}</Typography>
              <Chip 
                label={user?.user_type === 'buyer' ? 'Client' : user?.user_type} 
                color="primary" 
                size="small" 
                sx={{ mt: 1 }}
              />
            </Box>

            <Tabs
              orientation="vertical"
              value={activeTab}
              onChange={handleTabChange}
              sx={{ borderRight: 1, borderColor: 'divider' }}
            >
              <Tab icon={<Person />} iconPosition="start" label="Profil" />
              <Tab icon={<ShoppingBag />} iconPosition="start" label="Commandes" />
              <Tab icon={<Favorite />} iconPosition="start" label="Favoris" />
              <Tab icon={<Settings />} iconPosition="start" label="Paramètres" />
            </Tabs>
          </Paper>

          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Statistiques
            </Typography>
            {userStats.map((stat, index) => (
              <Box key={index} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">{stat.label}</Typography>
                <Typography variant="body2" fontWeight="bold">{stat.value}</Typography>
              </Box>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={9}>
          <Paper sx={{ p: 3 }}>
            {activeTab === 0 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Informations Personnelles
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Prénom</Typography>
                    <Typography variant="body1">{user?.first_name || 'Non renseigné'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Nom</Typography>
                    <Typography variant="body1">{user?.last_name || 'Non renseigné'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Email</Typography>
                    <Typography variant="body1">{user?.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Téléphone</Typography>
                    <Typography variant="body1">{user?.phone_number || 'Non renseigné'}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="body2" color="textSecondary">Adresse</Typography>
                    <Typography variant="body1">{user?.address || 'Non renseignée'}</Typography>
                  </Grid>
                </Grid>
                
                <Button 
                  variant="contained" 
                  sx={{ mt: 3 }}
                  disabled={loading.profile}
                >
                  {loading.profile ? <CircularProgress size={24} /> : 'Modifier le Profil'}
                </Button>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Mes Commandes
                </Typography>
                {loading.orders ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                  </Box>
                ) : orders.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <ShoppingBag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                      Aucune commande
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Vos commandes apparaîtront ici
                    </Typography>
                  </Box>
                ) : (
                  <List>
                    {orders.map((order) => (
                      <Card key={order.id} sx={{ mb: 2 }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="h6">Commande #{order.id}</Typography>
                              <Typography variant="body2" color="textSecondary">
                                {new Date(order.created_at).toLocaleDateString('fr-FR')} • {order.items?.length || 0} article(s)
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                Agriculteur: {order.farmer_info?.first_name} {order.farmer_info?.last_name}
                              </Typography>
                              
                              <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                                <Chip 
                                  label={getStatusText(order.status)} 
                                  color={getStatusColor(order.status)}
                                  size="small"
                                />
                              </Box>
                            </Box>
                            
                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h6" color="primary">
                                {parseFloat(order.total_amount || 0).toLocaleString()} FCFA
                              </Typography>
                              <Button variant="outlined" size="small" sx={{ mt: 1 }}>
                                Détails
                              </Button>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </List>
                )}
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Mes Favoris
                </Typography>
                {loading.favorites ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress />
                  </Box>
                ) : favorites.length === 0 ? (
                  <Box textAlign="center" py={4}>
                    <Favorite sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                      Aucun produit favori
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Ajoutez des produits à vos favoris
                    </Typography>
                  </Box>
                ) : (
                  <Grid container spacing={2}>
                    {favorites.map((product) => (
                      <Grid item xs={12} sm={6} key={product.id}>
                        <Card>
                          <CardContent>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <img 
                                src={product.images?.[0]?.image || '/placeholder-product.jpg'} 
                                alt={product.name}
                                style={{ 
                                  width: 60, 
                                  height: 60, 
                                  objectFit: 'cover',
                                  borderRadius: 8
                                }}
                              />
                              <Box sx={{ flex: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                  {product.name}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                  {product.farmer?.first_name} {product.farmer?.last_name}
                                </Typography>
                                <Typography variant="h6" color="primary">
                                  {parseFloat(product.price).toLocaleString()} FCFA / {product.unit}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                              <Button variant="contained" size="small">
                                Ajouter au panier
                              </Button>
                              <Button 
                                variant="outlined" 
                                size="small" 
                                color="error"
                                onClick={() => handleToggleFavorite(product.id)}
                              >
                                Retirer
                              </Button>
                            </Box>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Box>
            )}

            {activeTab === 3 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Paramètres du Compte
                </Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Sécurité
                        </Typography>
                        <Button variant="outlined" fullWidth sx={{ mb: 1 }}>
                          Changer le mot de passe
                        </Button>
                        <Button variant="outlined" fullWidth>
                          Paramètres de confidentialité
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Notifications
                        </Typography>
                        <Button variant="outlined" fullWidth>
                          Gérer les notifications
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  )
}

export default CustomerDashboard