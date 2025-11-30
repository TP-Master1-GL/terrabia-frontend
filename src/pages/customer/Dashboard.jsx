import React, { useState } from 'react'
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
  ListItemIcon
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

const CustomerDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Données mockées
  const userStats = [
    { label: 'Commandes', value: '12' },
    { label: 'Produits Favoris', value: '8' },
    { label: 'Dépenses Totales', value: '45K FCFA' }
  ]

  const recentOrders = [
    {
      id: 1,
      date: '2024-01-20',
      total: 8500,
      status: 'delivered',
      items: 3,
      farmer: 'Agriculteur Test',
      delivery_status: 'delivered'
    },
    {
      id: 2,
      date: '2024-01-18',
      total: 5200,
      status: 'in_delivery',
      items: 2,
      farmer: 'Jean Dupont',
      delivery_status: 'in_progress'
    },
    {
      id: 3,
      date: '2024-01-15',
      total: 3200,
      status: 'preparing',
      items: 1,
      farmer: 'Marie Lambert',
      delivery_status: 'pending'
    }
  ]

  const favorites = [
    {
      id: 1,
      name: 'Tomates Fraîches',
      price: 1200,
      unit: 'kg',
      farmer: 'Jean Dupont',
      image: '/placeholder-product.jpg'
    },
    {
      id: 2,
      name: 'Bananes Plantains',
      price: 800,
      unit: 'kg',
      farmer: 'Marie Lambert',
      image: '/placeholder-product.jpg'
    }
  ]

  const getStatusColor = (status) => {
    const colors = {
      pending: 'default',
      confirmed: 'primary',
      preparing: 'secondary',
      ready: 'warning',
      in_delivery: 'info',
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
      in_delivery: 'En livraison',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    }
    return texts[status] || status
  }

  const getDeliveryStatusIcon = (status) => {
    const icons = {
      pending: <Schedule color="warning" />,
      assigned: <LocalShipping color="info" />,
      in_progress: <LocalShipping color="secondary" />,
      delivered: <CheckCircle color="success" />
    }
    return icons[status] || <Schedule />
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Mon Compte
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bienvenue, {user?.name} ! Gérez vos informations et suivez vos commandes.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Person sx={{ fontSize: 60, color: 'primary.main', mb: 1 }} />
              <Typography variant="h6">{user?.name}</Typography>
              <Typography variant="body2" color="textSecondary">{user?.email}</Typography>
              <Chip 
                label="Client" 
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
                    <Typography variant="body2" color="textSecondary">Nom Complet</Typography>
                    <Typography variant="body1">{user?.name}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Email</Typography>
                    <Typography variant="body1">{user?.email}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Téléphone</Typography>
                    <Typography variant="body1">{user?.phone || 'Non renseigné'}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="body2" color="textSecondary">Adresse</Typography>
                    <Typography variant="body1">{user?.address || 'Non renseignée'}</Typography>
                  </Grid>
                </Grid>
                
                <Button variant="contained" sx={{ mt: 3 }}>
                  Modifier le Profil
                </Button>
              </Box>
            )}

            {activeTab === 1 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Mes Commandes
                </Typography>
                <List>
                  {recentOrders.map((order) => (
                    <Card key={order.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6">Commande #{order.id}</Typography>
                            <Typography variant="body2" color="textSecondary">
                              {new Date(order.date).toLocaleDateString('fr-FR')} • {order.items} article(s)
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Agriculteur: {order.farmer}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                              <Chip 
                                label={getStatusText(order.status)} 
                                color={getStatusColor(order.status)}
                                size="small"
                              />
                              <Chip 
                                icon={getDeliveryStatusIcon(order.delivery_status)}
                                label={order.delivery_status === 'delivered' ? 'Livrée' : 'En cours'}
                                variant="outlined"
                                size="small"
                              />
                            </Box>
                          </Box>
                          
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="h6" color="primary">
                              {order.total} FCFA
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
              </Box>
            )}

            {activeTab === 2 && (
              <Box>
                <Typography variant="h5" gutterBottom>
                  Mes Favoris
                </Typography>
                <Grid container spacing={2}>
                  {favorites.map((product) => (
                    <Grid item xs={12} sm={6} key={product.id}>
                      <Card>
                        <CardContent>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <img 
                              src={product.image} 
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
                                {product.farmer}
                              </Typography>
                              <Typography variant="h6" color="primary">
                                {product.price} FCFA / {product.unit}
                              </Typography>
                            </Box>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                            <Button variant="contained" size="small">
                              Ajouter au panier
                            </Button>
                            <Button variant="outlined" size="small" color="error">
                              Retirer
                            </Button>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
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