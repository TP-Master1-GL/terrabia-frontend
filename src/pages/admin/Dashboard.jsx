import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Tabs,
  Tab
} from '@mui/material'
import {
  Dashboard as DashboardIcon,
  People,
  Inventory,
  LocalShipping,
  Receipt,
  Business
} from '@mui/icons-material'
import StatsCard from '../../components/admin/StatsCard'
import UserManagement from '../../components/admin/UserManagement'
import ProductManagement from '../../components/admin/ProductManagement'
import OrderManagement from '../../components/admin/OrdersManagement'
import DeliveryManagement from '../../components/admin/DeliveryManagement'

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  // Données mockées
  const stats = [
    {
      title: 'Utilisateurs Totaux',
      value: '1,234',
      change: 12,
      icon: <People />,
      color: 'primary'
    },
    {
      title: 'Commandes du Mois',
      value: '456',
      change: 8,
      icon: <Receipt />,
      color: 'secondary'
    },
    {
      title: 'Produits Actifs',
      value: '789',
      change: 15,
      icon: <Inventory />,
      color: 'success'
    },
    {
      title: 'Revenus du Mois',
      value: '12.5M FCFA',
      change: 20,
      icon: <DashboardIcon />,
      color: 'warning'
    }
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Tableau de Bord Administrateur
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Gérez l'ensemble de la plateforme TERRABIA
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
            <Tab icon={<DashboardIcon />} label="Aperçu" />
            <Tab icon={<People />} label="Utilisateurs" />
            <Tab icon={<Inventory />} label="Produits" />
            <Tab icon={<Receipt />} label="Commandes" />
            <Tab icon={<LocalShipping />} label="Livraisons" />
            <Tab icon={<Business />} label="Entreprises" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Aperçu Général
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Activité Récente
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Graphiques d'activité à implémenter
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, textAlign: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Statistiques
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Tableaux de statistiques à implémenter
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}

          {activeTab === 1 && <UserManagement />}
          {activeTab === 2 && <ProductManagement />}
          {activeTab === 3 && <OrderManagement />}
          {activeTab === 4 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Gestion des Livraisons
              </Typography>
              <Typography color="textSecondary">
                Interface de suivi des livraisons à implémenter
              </Typography>
            </Box>
          )}
          {activeTab === 5 && <DeliveryManagement />}
        </Box>
      </Paper>
    </Container>
  )
}

export default AdminDashboard