import React, { useState } from 'react'
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
  CardContent
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

const FarmerDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [showProductForm, setShowProductForm] = useState(false)

  // Données mockées
  const stats = [
    {
      title: 'Produits Actifs',
      value: '12',
      change: 8,
      icon: <Inventory />
    },
    {
      title: 'Commandes du Mois',
      value: '24',
      change: 15,
      icon: <Receipt />
    },
    {
      title: 'Revenus du Mois',
      value: '156K FCFA',
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

  const products = [
    {
      id: 1,
      name: 'Tomates Fraîches',
      category: 'Légumes',
      price: 1200,
      quantity: 50,
      unit: 'kg',
      description: 'Tomates rouges et juteuses cultivées localement',
      images: ['/placeholder-product.jpg'],
      is_available: true,
      sales: 15
    },
    {
      id: 2,
      name: 'Oignons Locaux',
      category: 'Légumes',
      price: 600,
      quantity: 100,
      unit: 'kg',
      description: 'Oignons frais et parfumés',
      images: ['/placeholder-product.jpg'],
      is_available: true,
      sales: 8
    }
  ]

  const orders = [
    {
      id: 1,
      customer: { name: 'Marie Lambert', phone: '+237 6 54 32 10 97' },
      total: 8500,
      status: 'confirmed',
      items: [
        { product: 'Tomates Fraîches', quantity: 2, price: 1200 },
        { product: 'Oignons Locaux', quantity: 1, price: 600 }
      ],
      created_at: '2024-01-20 10:00',
      delivery_address: 'Yaoundé, Cameroun'
    }
  ]

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleAddProduct = (formData) => {
    console.log('Ajouter produit:', formData)
    setShowProductForm(false)
  }

  const handleEditProduct = (product) => {
    console.log('Modifier produit:', product)
    setShowProductForm(true)
  }

  const handleDeleteProduct = (productId) => {
    console.log('Supprimer produit:', productId)
  }

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    console.log('Mettre à jour commande:', orderId, newStatus)
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Tableau de Bord Agriculteur
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bienvenue, {user?.name} ! Gérez vos produits et suivez vos ventes.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
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
                >
                  Ajouter un Produit
                </Button>
              </Box>

              {showProductForm ? (
                <ProductForm 
                  onSubmit={handleAddProduct}
                  onCancel={() => setShowProductForm(false)}
                />
              ) : (
                <ProductList
                  products={products}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
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
                  <Button variant="contained" sx={{ mt: 2 }}>
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
                        Graphique des ventes à implémenter
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