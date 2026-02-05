// pages/farmer/Dashboard.jsx - Version corrigée
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
  CircularProgress,
  Snackbar
} from '@mui/material'
import {
  Add,
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
import ApiService from '../../services/apiService'

const FarmerDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [showProductForm, setShowProductForm] = useState(false)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [categories, setCategories] = useState([])

  // Charger les données initiales
  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user, activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      // Charger les produits du farmer
      if (activeTab === 0 || activeTab === 3) {
        const productsData = await ApiService.getMyProducts()
        setProducts(Array.isArray(productsData) ? productsData : [])
      }

      // Charger les commandes du farmer
      if (activeTab === 1 || activeTab === 3) {
        const ordersData = await ApiService.getFarmerOrders()
        setOrders(Array.isArray(ordersData) ? ordersData : [])
      }

      // Charger les catégories pour les statistiques
      if (activeTab === 3) {
        try {
          const categoriesData = await ApiService.getCategories()
          setCategories(Array.isArray(categoriesData) ? categoriesData : [])
        } catch (err) {
          console.error('Erreur chargement catégories:', err)
        }
      }
    } catch (err) {
      console.error('Load data error:', err)
      setError(err.message || 'Erreur lors du chargement des données')
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
      console.log('Creating product with FormData')
      
      // Utiliser ApiService pour créer le produit
      const newProduct = await ApiService.createProduct(formData)
      
      setProducts(prev => [newProduct, ...prev])
      setShowProductForm(false)
      setSuccess('Produit créé avec succès!')
      await loadData() // Recharger les données
    } catch (err) {
      console.error('Error creating product:', err)
      setError(err.message || 'Erreur lors de la création du produit')
      throw err
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
      
      // Utiliser ApiService pour mettre à jour le produit
      const updatedProduct = await ApiService.updateProduct(editingProduct.id, formData)
      
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p))
      setShowProductForm(false)
      setEditingProduct(null)
      setSuccess('Produit modifié avec succès!')
      await loadData() // Recharger les données
    } catch (err) {
      console.error('Error updating product:', err)
      setError(err.message || 'Erreur lors de la modification du produit')
      throw err
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (productId) => {
    try {
      setError('')
      await ApiService.deleteProduct(productId)
      setProducts(prev => prev.filter(p => p.id !== productId))
      setSuccess('Produit supprimé avec succès!')
      await loadData() // Recharger les données
    } catch (err) {
      console.error('Error deleting product:', err)
      setError(err.message || 'Erreur lors de la suppression du produit')
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      setError('')
      const updatedOrder = await ApiService.updateOrderStatus(orderId, newStatus)
      setOrders(prev => prev.map(o => o.id === orderId ? updatedOrder : o))
      setSuccess('Statut de commande mis à jour!')
      await loadData() // Recharger les données
    } catch (err) {
      console.error('Error updating order status:', err)
      setError(err.message || 'Erreur lors de la mise à jour du statut')
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
      if (!order.created_at) return false
      const orderDate = new Date(order.created_at)
      return orderDate.getMonth() === currentMonth && orderDate.getFullYear() === currentYear
    })

    const monthlyRevenue = monthlyOrders.reduce((sum, order) => {
      return sum + (parseFloat(order.total_amount) || 0)
    }, 0)

    const activeProducts = products.filter(p => p.available).length
    const totalProducts = products.length

    return [
      {
        title: 'Produits Actifs',
        value: `${activeProducts}/${totalProducts}`,
        change: activeProducts > 0 ? Math.round((activeProducts / totalProducts) * 100) : 0,
        icon: <Inventory />
      },
      {
        title: 'Commandes du Mois',
        value: monthlyOrders.length.toString(),
        change: monthlyOrders.length > 0 ? 15 : 0,
        icon: <Receipt />
      },
      {
        title: 'Revenus du Mois',
        value: `${monthlyRevenue.toLocaleString('fr-FR')} FCFA`,
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

  // Préparer les données pour les graphiques
  const getAnalyticsData = () => {
    // Grouper les ventes par mois
    const salesByMonth = {}
    orders.forEach(order => {
      if (order.created_at) {
        const date = new Date(order.created_at)
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`
        salesByMonth[monthYear] = (salesByMonth[monthYear] || 0) + (parseFloat(order.total_amount) || 0)
      }
    })

    // Produits les plus vendus
    const productSales = {}
    orders.forEach(order => {
      if (order.items && Array.isArray(order.items)) {
        order.items.forEach(item => {
          if (item.product_name) {
            productSales[item.product_name] = (productSales[item.product_name] || 0) + (item.quantity || 0)
          }
        })
      }
    })

    return {
      monthlySales: Object.entries(salesByMonth).map(([month, amount]) => ({
        month,
        amount
      })),
      topProducts: Object.entries(productSales)
        .map(([name, quantity]) => ({ name, quantity }))
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5),
      categoriesStats: categories.map(cat => ({
        name: cat.name,
        count: products.filter(p => p.category_id === cat.id).length
      }))
    }
  }

  const handleCloseSnackbar = () => {
    setSuccess('')
    setError('')
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Tableau de Bord Agriculteur
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bienvenue, {user?.first_name || 'Agriculteur'} ! Gérez vos produits et suivez vos ventes.
        </Typography>
      </Box>

      {/* Notifications */}
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar 
        open={!!success} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {success}
        </Alert>
      </Snackbar>

      {/* Statistiques */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {calculateStats().map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatsCard {...stat} />
          </Grid>
        ))}
      </Grid>

      <Paper sx={{ width: '100%', borderRadius: 2 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab label="Mes Produits" />
            <Tab label="Commandes" />
            <Tab label="Analytiques" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {/* Onglet Mes Produits */}
          {activeTab === 0 && (
            <Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3 
              }}>
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
              ) : loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : (
                <ProductList
                  products={products}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  loading={false}
                />
              )}
            </Box>
          )}

          {/* Onglet Commandes */}
          {activeTab === 1 && (
            <Box>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 3 
              }}>
                <Typography variant="h5">
                  Commandes Reçues ({orders.length})
                </Typography>
              </Box>
              
              {loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : orders.length === 0 ? (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <Receipt sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Aucune commande pour le moment
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Vos commandes apparaîtront ici lorsqu'un client achètera vos produits
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <OrderList
                  orders={orders}
                  onUpdateStatus={handleUpdateOrderStatus}
                  loading={loading}
                />
              )}
            </Box>
          )}

          {/* Onglet Analytiques */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Analytiques
              </Typography>
              <Grid container spacing={3}>
                {/* Ventes mensuelles */}
                <Grid item xs={12} md={8}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Ventes Mensuelles
                      </Typography>
                      {getAnalyticsData().monthlySales.length > 0 ? (
                        <Box>
                          {getAnalyticsData().monthlySales.map((sale, index) => (
                            <Box 
                              key={index} 
                              sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                mb: 1,
                                p: 1,
                                backgroundColor: 'grey.50',
                                borderRadius: 1
                              }}
                            >
                              <Typography variant="body2">{sale.month}</Typography>
                              <Typography variant="body1" fontWeight="bold">
                                {sale.amount.toLocaleString('fr-FR')} FCFA
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      ) : (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                          <Typography variant="body2" color="textSecondary">
                            Aucune vente enregistrée
                          </Typography>
                        </Box>
                      )}
                    </CardContent>
                  </Card>
                </Grid>

                {/* Produits populaires */}
                <Grid item xs={12} md={4}>
                  <Card sx={{ height: '100%' }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Produits Populaires
                      </Typography>
                      <Box sx={{ mt: 2 }}>
                        {getAnalyticsData().topProducts.length > 0 ? (
                          getAnalyticsData().topProducts.map((product, index) => (
                            <Box 
                              key={index} 
                              sx={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'center',
                                py: 1,
                                borderBottom: index < 4 ? '1px solid' : 'none',
                                borderColor: 'divider'
                              }}
                            >
                              <Typography variant="body2">
                                {index + 1}. {product.name}
                              </Typography>
                              <Typography variant="body2" color="textSecondary">
                                {product.quantity} ventes
                              </Typography>
                            </Box>
                          ))
                        ) : (
                          <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                            Aucune vente enregistrée
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Répartition par catégorie */}
                <Grid item xs={12}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Répartition des Produits par Catégorie
                      </Typography>
                      <Grid container spacing={2}>
                        {getAnalyticsData().categoriesStats.map((category, index) => (
                          <Grid item xs={6} sm={4} md={3} key={index}>
                            <Paper sx={{ p: 2, textAlign: 'center' }}>
                              <Typography variant="h6" color="primary">
                                {category.count}
                              </Typography>
                              <Typography variant="body2" noWrap>
                                {category.name}
                              </Typography>
                            </Paper>
                          </Grid>
                        ))}
                        {getAnalyticsData().categoriesStats.length === 0 && (
                          <Grid item xs={12}>
                            <Typography variant="body2" color="textSecondary" sx={{ textAlign: 'center', py: 2 }}>
                              Aucun produit catégorisé
                            </Typography>
                          </Grid>
                        )}
                      </Grid>
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