// pages/farmer/Dashboard.jsx
import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Alert
} from '@mui/material'
import {
  Add,
  Dashboard as DashboardIcon,
  Inventory,
  Receipt,
  Chat,
  TrendingUp
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import StatsCard from '../../components/admin/StatsCard'
import ProductList from '../../components/farmer/ProductList'
import ProductForm from '../../components/farmer/ProductForm'
import OrderList from '../../components/farmer/OrderList'
import { authAPI, productsAPI } from '../../services/api'

const FarmerDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [showProductForm, setShowProductForm] = useState(false)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Charger les données
  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      if (activeTab === 0) {
        // Charger les produits
        const productsResponse = await authAPI.getMyProducts()
        setProducts(productsResponse.data)
      } else if (activeTab === 1) {
        // Charger les commandes
        const ordersResponse = await authAPI.getMyOrders()
        setOrders(ordersResponse.data)
      } else if (activeTab === 3) {
        // Charger les statistiques
        const statsResponse = await authAPI.getStats()
        setStats(statsResponse.data)
      }
    } catch (err) {
      setError('Erreur lors du chargement des données')
      console.error('Load data error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleAddProduct = async (formData) => {
    try {
      setLoading(true)
      const response = await authAPI.createProduct(formData)
      setProducts(prev => [response.data, ...prev])
      setShowProductForm(false)
      setError('')
    } catch (err) {
      setError('Erreur lors de la création du produit')
    } finally {
      setLoading(false)
    }
  }

  const handleEditProduct = async (productId, productData) => {
    try {
      const response = await authAPI.updateProduct(productId, productData)
      setProducts(prev => prev.map(p => p.id === productId ? response.data : p))
      setError('')
    } catch (err) {
      setError('Erreur lors de la modification du produit')
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await authAPI.deleteProduct(productId)
      setProducts(prev => prev.filter(p => p.id !== productId))
      setError('')
    } catch (err) {
      setError('Erreur lors de la suppression du produit')
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await authAPI.updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o.id === orderId ? response.data : o))
      setError('')
    } catch (err) {
      setError('Erreur lors de la mise à jour du statut')
    }
  }

  // Statistiques par défaut si l'API n'est pas encore implémentée
  const defaultStats = [
    {
      title: 'Produits Actifs',
      value: products.length.toString(),
      change: 8,
      icon: <Inventory />
    },
    {
      title: 'Commandes du Mois',
      value: orders.filter(o => new Date(o.created_at).getMonth() === new Date().getMonth()).length.toString(),
      change: 15,
      icon: <Receipt />
    },
    {
      title: 'Revenus du Mois',
      value: `${orders
        .filter(o => new Date(o.created_at).getMonth() === new Date().getMonth())
        .reduce((sum, order) => sum + order.total, 0)
        .toLocaleString()} FCFA`,
      change: 12,
      icon: <TrendingUp />
    },
    {
      title: 'Notes Moyennes',
      value: '4.2/5',
      change: 5,
      icon: <Chat />
    }
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Tableau de Bord Agriculteur
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bienvenue, {user?.first_name} ! Gérez vos produits et suivez vos ventes.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {(stats.length > 0 ? stats : defaultStats).map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Mes Produits" />
            <Tab label="Commandes" />
            <Tab label="Messages" />
            <Tab label="Analytiques" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  Mes Produits
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setShowProductForm(true)}
                  disabled={loading}
                >
                  Ajouter un Produit
                </Button>
              </Box>

              {showProductForm ? (
                <ProductForm 
                  onSubmit={handleAddProduct}
                  onCancel={() => setShowProductForm(false)}
                  loading={loading}
                />
              ) : (
                <ProductList
                  products={products}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  loading={loading}
                />
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Commandes Reçues
              </Typography>
              <OrderList
                orders={orders}
                onUpdateStatus={handleUpdateOrderStatus}
                loading={loading}
              />
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Messages
              </Typography>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 6 }}>
                  <Chat sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Interface de messagerie
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Connectez-vous avec vos clients via la messagerie intégrée
                  </Typography>
                  <Button 
                    variant="contained" 
                    sx={{ mt: 2 }}
                    onClick={() => window.location.href = '/chat'}
                  >
                    Ouvrir la Messagerie
                  </Button>
                </CardContent>
              </Card>
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Analytiques
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Ventes Mensuelles
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Graphique des ventes à implémenter avec les données de l'API
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Produits Populaires
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Tableau des produits les plus vendus à implémenter
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  )
}

export default FarmerDashboard