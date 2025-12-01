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
  Alert,
  CircularProgress
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
import { productsAPI, ordersAPI } from '../../services/api' // ✅ Import correct des APIs

const FarmerDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [showProductForm, setShowProductForm] = useState(false)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)

  // Charger les données
  useEffect(() => {
    loadData()
  }, [activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      if (activeTab === 0) {
        // Charger les produits du farmer - CORRIGÉ
        const productsResponse = await productsAPI.getMyProducts()
        setProducts(productsResponse.data || [])
      } else if (activeTab === 1) {
        // Charger les commandes du farmer - CORRIGÉ
        const ordersResponse = await ordersAPI.getFarmerOrders()
        setOrders(ordersResponse.data || [])
      }
    } catch (err) {
      console.error('Load data error:', err)
      if (err.response?.status === 404) {
        // API endpoints might not exist yet, set empty arrays
        if (activeTab === 0) setProducts([])
        if (activeTab === 1) setOrders([])
      } else {
        setError('Erreur lors du chargement des données')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setShowProductForm(false)
    setEditingProduct(null)
  }

  const handleAddProduct = async (formData) => {
    try {
      setLoading(true)
      setError('')
      console.log('Adding product with data:', formData)
      
      const response = await productsAPI.create(formData)
      console.log('Product created:', response.data)
      
      setProducts(prev => [response.data, ...prev])
      setShowProductForm(false)
      await loadData() // Recharger les données
    } catch (err) {
      console.error('Error creating product:', err)
      setError(err.response?.data?.message || 'Erreur lors de la création du produit')
      throw err // Propager l'erreur pour que ProductForm puisse la gérer
    } finally {
      setLoading(false)
    }
  }

  const handleEditProduct = async (product) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const handleUpdateProduct = async (formData) => {
    try {
      setLoading(true)
      setError('')
      
      const response = await productsAPI.update(editingProduct.id, formData)
      console.log('Product updated:', response.data)
      
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? response.data : p))
      setShowProductForm(false)
      setEditingProduct(null)
      await loadData() // Recharger les données
    } catch (err) {
      console.error('Error updating product:', err)
      setError(err.response?.data?.message || 'Erreur lors de la modification du produit')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      setError('')
      await productsAPI.delete(productId)
      setProducts(prev => prev.filter(p => p.id !== productId))
      await loadData() // Recharger les données
    } catch (err) {
      console.error('Error deleting product:', err)
      setError(err.response?.data?.message || 'Erreur lors de la suppression du produit')
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setError('')
      const response = await ordersAPI.updateStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o.id === orderId ? response.data : o))
      await loadData() // Recharger les données
    } catch (err) {
      console.error('Error updating order status:', err)
      setError(err.response?.data?.message || 'Erreur lors de la mise à jour du statut')
    }
  }

  const handleCancelForm = () => {
    setShowProductForm(false)
    setEditingProduct(null)
  }

  // Calcul des statistiques en temps réel
  const calculateStats = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    
    const monthlyOrders = orders.filter(order => {
      const orderDate = new Date(order.created_at)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    })

    const monthlyRevenue = monthlyOrders.reduce((sum, order) => {
      return sum + parseFloat(order.total_amount || 0)
    }, 0)

    const activeProducts = products.filter(p => p.available).length

    return [
      {
        title: 'Produits Actifs',
        value: activeProducts.toString(),
        change: 8,
        icon: <Inventory />
      },
      {
        title: 'Commandes du Mois',
        value: monthlyOrders.length.toString(),
        change: 15,
        icon: <Receipt />
      },
      {
        title: 'Revenus du Mois',
        value: `${monthlyRevenue.toLocaleString()} FCFA`,
        change: monthlyRevenue > 0 ? 12 : 0,
        icon: <TrendingUp />
      },
      {
        title: 'Satisfaction',
        value: '4.2/5',
        change: 5,
        icon: <Chat />
      }
    ]
  }

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
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          onClose={() => setError('')}
        >
          {error}
        </Alert>
      )}

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {calculateStats().map((stat, index) => (
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
                  Mes Produits ({products.length})
                </Typography>
                {!showProductForm && (
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setShowProductForm(true)}
                    disabled={loading}
                  >
                    Ajouter un Produit
                  </Button>
                )}
              </Box>

              {showProductForm ? (
                <ProductForm 
                  onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
                  initialData={editingProduct}
                  onCancel={handleCancelForm}
                  loading={loading}
                />
              ) : (
                <ProductList
                  products={products}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  loading={loading}
                  error={error}
                />
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5">
                  Commandes Reçues ({orders.length})
                </Typography>
              </Box>
              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <OrderList
                  orders={orders}
                  onUpdateStatus={handleUpdateOrderStatus}
                  loading={loading}
                  error={error}
                />
              )}
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
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="textSecondary">
                          Graphique des ventes à implémenter
                        </Typography>
                        <Typography variant="h4" color="primary" sx={{ mt: 2 }}>
                          {calculateStats()[1].value} commandes
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Produits Populaires
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {products.slice(0, 3).map((product, index) => (
                          <Box key={product.id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                            <Typography variant="body2">
                              {index + 1}. {product.name}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              {product.price} FCFA
                            </Typography>
                          </Box>
                        ))}
                        {products.length === 0 && (
                          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                            Aucun produit
                          </Typography>
                        )}
                      </Box>
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