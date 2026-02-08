// pages/farmer/Dashboard.jsx - Version corrigée
import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Button,
  Card,
  CardContent,
  Alert,
  CircularProgress,
  Snackbar,
  CardMedia,
  IconButton,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Grid // IMPORT STANDARD - PAS Grid2
} from '@mui/material' // Import depuis @mui/material
import {
  Add,
  Inventory,
  Receipt,
  Chat,
  TrendingUp,
  Edit,
  Delete,
  Clear,
  CloudUpload
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import StatsCard from '../../components/admin/StatsCard'
import OrderList from '../../components/farmer/OrderList'
import apiService from '../../services/apiService'
import { PRODUCT_CATEGORIES } from '../../utils/Constants'

const FarmerDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [showProductForm, setShowProductForm] = useState(false)
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [editingProduct, setEditingProduct] = useState(null)
  const [categories, setCategories] = useState([])

  // Formulaire produit
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    unit: '',
    stock: '',
    category_id: '',
    available: true,
    image: null
  })
  const [imagePreview, setImagePreview] = useState(null)

  // Fonction pour obtenir l'URL de l'image d'un produit
  const getProductImage = (product) => {
    if (!product.images || product.images.length === 0) {
      return '/placeholder-product.jpg';
    }
    return product.images[0].image;
  };

  const getCategoryName = (product) => {
    return product.category?.name || 'Sans catégorie';
  };

  useEffect(() => {
    if (user) {
      loadData()
      loadCategories()
    }
  }, [user, activeTab])

  const loadData = async () => {
    try {
      setLoading(true)
      setError('')

      if (activeTab === 0 || activeTab === 2) {
        const productsData = await apiService.getMyProducts()
        setProducts(Array.isArray(productsData) ? productsData : [])
      }

      if (activeTab === 1 || activeTab === 2) {
        const ordersData = await apiService.getFarmerOrders()
        setOrders(Array.isArray(ordersData) ? ordersData : [])
      }
    } catch (err) {
      console.error('Load data error:', err)
      setError(err.message || 'Erreur lors du chargement des données')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      if (typeof apiService.getCategories === 'function') {
        const categoriesData = await apiService.getCategories()
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
      } else {
        try {
          const response = await fetch('http://localhost:8000/api/products/categories/')
          if (response.ok) {
            const data = await response.json()
            setCategories(Array.isArray(data) ? data : [])
          } else {
            throw new Error('Échec chargement catégories')
          }
        } catch (fetchError) {
          setCategories(PRODUCT_CATEGORIES.map((cat, index) => ({ 
            id: index + 1, 
            name: cat,
            slug: cat.toLowerCase().replace(/\s+/g, '-')
          })))
        }
      }
    } catch (err) {
      setCategories(PRODUCT_CATEGORIES.map((cat, index) => ({ 
        id: index + 1, 
        name: cat 
      })))
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
    setShowProductForm(false)
    setEditingProduct(null)
    resetForm()
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      unit: '',
      stock: '',
      category_id: '',
      available: true,
      image: null
    })
    setImagePreview(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    setFormData({
      ...formData,
      image: file
    })

    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const handleAddProduct = async () => {
    try {
      setLoading(true)
      setError('')
      
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('unit', formData.unit)
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('category_id', formData.category_id)
      formDataToSend.append('available', formData.available)
      
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      }

      const newProduct = await apiService.createProduct(formDataToSend)
      
      setProducts(prev => [newProduct, ...prev])
      setShowProductForm(false)
      setSuccess('Produit créé avec succès!')
      resetForm()
      await loadData()
    } catch (err) {
      console.error('Error creating product:', err)
      setError(err.message || 'Erreur lors de la création du produit')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProduct = async () => {
    try {
      setLoading(true)
      setError('')
      
      const formDataToSend = new FormData()
      formDataToSend.append('name', formData.name)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price)
      formDataToSend.append('unit', formData.unit)
      formDataToSend.append('stock', formData.stock)
      formDataToSend.append('category_id', formData.category_id)
      formDataToSend.append('available', formData.available)
      
      if (formData.image) {
        formDataToSend.append('image', formData.image)
      } else if (editingProduct && editingProduct.images && editingProduct.images.length > 0) {
        formDataToSend.append('keep_existing_image', 'true')
      }

      const updatedProduct = await apiService.updateProduct(editingProduct.id, formDataToSend)
      
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p))
      setShowProductForm(false)
      setEditingProduct(null)
      setSuccess('Produit modifié avec succès!')
      resetForm()
      await loadData()
    } catch (err) {
      console.error('Error updating product:', err)
      setError(err.message || 'Erreur lors de la modification du produit')
    } finally {
      setLoading(false)
    }
  }

  const handleEditProduct = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      unit: product.unit || '',
      stock: product.stock || '',
      category_id: product.category_id || product.category?.id || '',
      available: product.available !== undefined ? product.available : true,
      image: null
    })
    
    if (product.images && product.images.length > 0) {
      setImagePreview(product.images[0].image)
    } else {
      setImagePreview(null)
    }
    
    setShowProductForm(true)
  }

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      return
    }
    
    try {
      setError('')
      await apiService.deleteProduct(productId)
      setProducts(prev => prev.filter(p => p.id !== productId))
      setSuccess('Produit supprimé avec succès!')
      await loadData()
    } catch (err) {
      console.error('Error deleting product:', err)
      setError(err.message || 'Erreur lors de la suppression du produit')
    }
  }

  const handleCancelForm = () => {
    setShowProductForm(false)
    setEditingProduct(null)
    resetForm()
  }

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

  const handleCloseSnackbar = () => {
    setSuccess('')
    setError('')
  }

  // Composant de formulaire intégré - CORRIGÉ avec Grid standard
  const ProductFormComponent = () => (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h5" gutterBottom>
        {editingProduct ? 'Modifier le Produit' : 'Ajouter un Nouveau Produit'}
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        <TextField
          label="Nom du produit *"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          fullWidth
          disabled={loading}
        />
        
        <TextField
          label="Description *"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          multiline
          rows={3}
          fullWidth
          disabled={loading}
        />
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Prix *"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleInputChange}
              fullWidth
              disabled={loading}
            />
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth disabled={loading}>
              <InputLabel>Unité *</InputLabel>
              <Select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                label="Unité *"
              >
                <MenuItem value="kg">Kilogramme</MenuItem>
                <MenuItem value="piece">Pièce</MenuItem>
                <MenuItem value="sac">Sac</MenuItem>
                <MenuItem value="litre">Litre</MenuItem>
                <MenuItem value="botte">Botte</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={4}>
            <TextField
              label="Stock *"
              name="stock"
              type="number"
              value={formData.stock}
              onChange={handleInputChange}
              fullWidth
              disabled={loading}
            />
          </Grid>
        </Grid>
        
        <FormControl fullWidth disabled={loading}>
          <InputLabel>Catégorie *</InputLabel>
          <Select
            name="category_id"
            value={formData.category_id}
            onChange={handleInputChange}
            label="Catégorie *"
          >
            <MenuItem value="">
              <em>Sélectionner une catégorie</em>
            </MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        
        <Box>
          <Typography variant="subtitle2" gutterBottom>
            Image du produit
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<CloudUpload />}
              disabled={loading}
            >
              Télécharger
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
            
            {imagePreview && (
              <Box sx={{ position: 'relative' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 100, height: 100, borderRadius: 1, objectFit: 'cover' }}
                  image={imagePreview}
                  alt="Preview"
                  onError={(e) => {
                    e.target.src = '/placeholder-product.jpg'
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => {
                    setImagePreview(null)
                    setFormData({ ...formData, image: null })
                  }}
                  sx={{ position: 'absolute', top: -8, right: -8, bgcolor: 'white' }}
                >
                  <Clear />
                </IconButton>
              </Box>
            )}
            
            <Typography variant="caption" color="text.secondary">
              {formData.image ? formData.image.name : editingProduct && editingProduct.images && editingProduct.images.length > 0 ? 'Image existante' : 'Aucune image'}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button
            variant="outlined"
            onClick={handleCancelForm}
            disabled={loading}
          >
            Annuler
          </Button>
          <Button
            variant="contained"
            onClick={editingProduct ? handleUpdateProduct : handleAddProduct}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? 'Enregistrement...' : editingProduct ? 'Mettre à jour' : 'Créer'}
          </Button>
        </Box>
      </Box>
    </Paper>
  )

  // Composant de liste de produits - CORRIGÉ avec Grid standard
  const ProductListComponent = () => (
    <Grid container spacing={3}>
      {products.map((product) => (
        <Grid item xs={12} sm={6} md={4} key={product.id}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardMedia
              component="img"
              height="140"
              image={getProductImage(product)}
              alt={product.name}
              sx={{ objectFit: 'cover' }}
              onError={(e) => {
                e.target.src = '/placeholder-product.jpg'
              }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2, height: 60, overflow: 'hidden' }}>
                {product.description?.substring(0, 100)}...
              </Typography>
              
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Catégorie: {getCategoryName(product)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Stock: {product.stock} {product.unit}
                </Typography>
              </Box>
              
              <Typography variant="h6" color="primary">
                {parseFloat(product.price).toLocaleString('fr-FR')} FCFA / {product.unit}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<Edit />}
                  onClick={() => handleEditProduct(product)}
                >
                  Modifier
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleDeleteProduct(product.id)}
                >
                  Supprimer
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Tableau de Bord Agriculteur
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Bienvenue, {user?.first_name || 'Agriculteur'} ! Gérez vos produits et suivez vos ventes.
        </Typography>
      </Box>

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

      {/* Statistiques - CORRIGÉ avec Grid standard */}
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
                <ProductFormComponent />
              ) : loading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : products.length === 0 ? (
                <Alert severity="info">
                  Vous n'avez pas encore de produits. Cliquez sur "Ajouter un Produit" pour commencer.
                </Alert>
              ) : (
                <ProductListComponent />
              )}
            </Box>
          )}

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
                    <Typography variant="body2" color="text.secondary">
                      Vos commandes apparaîtront ici lorsqu'un client achètera vos produits
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <OrderList
                  orders={orders}
                  onUpdateStatus={apiService.updateOrderStatus}
                  loading={loading}
                />
              )}
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Analytiques
              </Typography>
              <Alert severity="info">
                Cette fonctionnalité est en cours de développement.
              </Alert>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  )
}

export default FarmerDashboard