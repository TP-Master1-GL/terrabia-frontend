import React, { useState } from 'react'
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Tabs,
  Tab
} from '@mui/material'
import {
  LocalShipping,
  CheckCircle,
  Pending,
  DirectionsCar,
  Assignment,
  Person,
  History
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'

const DeliveryDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [deliveries, setDeliveries] = useState([
    {
      id: 1,
      order_id: 1001,
      customer: 'Client Test',
      address: 'Yaoundé, Cameroun - Rue 1.234',
      phone: '+237 6 54 32 10 97',
      status: 'pending',
      created_at: '2024-01-20 10:00',
      items: ['Tomates (2kg)', 'Oignons (1kg)'],
      total: 8500,
      farmer: 'Agriculteur Test'
    },
    {
      id: 2,
      order_id: 1002,
      customer: 'Marie Lambert',
      address: 'Douala, Cameroun - Avenue 5.678',
      phone: '+237 6 54 32 10 96',
      status: 'accepted',
      created_at: '2024-01-20 09:30',
      items: ['Bananes (3kg)'],
      total: 2400,
      farmer: 'Jean Dupont'
    },
    {
      id: 3,
      order_id: 1003,
      customer: 'Pierre Ngo',
      address: 'Yaoundé, Cameroun - Boulevard 9.101',
      phone: '+237 6 54 32 10 95',
      status: 'completed',
      created_at: '2024-01-19 14:20',
      items: ['Carottes (1kg)', 'Piments (0.5kg)'],
      total: 2100,
      farmer: 'Alice Mbarga'
    }
  ])

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleAcceptDelivery = (deliveryId) => {
    setDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, status: 'accepted', accepted_at: new Date().toLocaleString() }
          : delivery
      )
    )
  }

  const handleStartDelivery = (deliveryId) => {
    setDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, status: 'in_progress', started_at: new Date().toLocaleString() }
          : delivery
      )
    )
  }

  const handleCompleteDelivery = (deliveryId) => {
    setDeliveries(prev => 
      prev.map(delivery => 
        delivery.id === deliveryId 
          ? { ...delivery, status: 'completed', completed_at: new Date().toLocaleString() }
          : delivery
      )
    )
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      accepted: 'info',
      in_progress: 'secondary',
      completed: 'success',
      cancelled: 'error'
    }
    return colors[status] || 'default'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'En attente',
      accepted: 'Acceptée',
      in_progress: 'En cours',
      completed: 'Livrée',
      cancelled: 'Annulée'
    }
    return texts[status] || status
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Pending />,
      accepted: <Assignment />,
      in_progress: <DirectionsCar />,
      completed: <CheckCircle />
    }
    return icons[status] || <Pending />
  }

  const pendingDeliveries = deliveries.filter(d => d.status === 'pending')
  const activeDeliveries = deliveries.filter(d => ['accepted', 'in_progress'].includes(d.status))
  const completedDeliveries = deliveries.filter(d => d.status === 'completed')

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Tableau de Bord Livreur
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Bienvenue, {user?.name} ! Gérez vos livraisons.
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Livraisons totales
              </Typography>
              <Typography variant="h4" component="div">
                {deliveries.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                En attente
              </Typography>
              <Typography variant="h4" component="div" color="warning.main">
                {pendingDeliveries.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                En cours
              </Typography>
              <Typography variant="h4" component="div" color="info.main">
                {activeDeliveries.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Terminées
              </Typography>
              <Typography variant="h4" component="div" color="success.main">
                {completedDeliveries.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            <Tab icon={<Pending />} label={`En attente (${pendingDeliveries.length})`} />
            <Tab icon={<DirectionsCar />} label={`En cours (${activeDeliveries.length})`} />
            <Tab icon={<History />} label={`Historique (${completedDeliveries.length})`} />
            <Tab icon={<Person />} label="Mon Profil" />
          </Tabs>
        </Box>

        <Box sx={{ p: 3 }}>
          {activeTab === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Livraisons en attente
              </Typography>
              {pendingDeliveries.length === 0 ? (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <Pending sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                      Aucune livraison en attente
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Les nouvelles livraisons apparaîtront ici
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <List>
                  {pendingDeliveries.map((delivery) => (
                    <Card key={delivery.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              Commande #{delivery.order_id}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                              <Person fontSize="small" color="action" />
                              <Typography variant="body1">
                                {delivery.customer}
                              </Typography>
                            </Box>
                            
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              📞 {delivery.phone}
                            </Typography>
                            
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              📍 {delivery.address}
                            </Typography>
                            
                            <Typography variant="body2" gutterBottom>
                              🛒 Articles: {delivery.items.join(', ')}
                            </Typography>
                            
                            <Typography variant="body2" gutterBottom>
                              👨‍🌾 Agriculteur: {delivery.farmer}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Chip 
                                label={getStatusText(delivery.status)} 
                                color={getStatusColor(delivery.status)}
                                icon={getStatusIcon(delivery.status)}
                              />
                              <Typography variant="h6" color="primary">
                                {delivery.total} FCFA
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          <Button
                            variant="contained"
                            startIcon={<CheckCircle />}
                            onClick={() => handleAcceptDelivery(delivery.id)}
                            fullWidth
                          >
                            Accepter la Livraison
                          </Button>
                        </Box>
                        
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                          Créée le: {delivery.created_at}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </List>
              )}
            </Box>
          )}

          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Livraisons en cours
              </Typography>
              {activeDeliveries.length === 0 ? (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <DirectionsCar sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                      Aucune livraison en cours
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Acceptez une livraison pour commencer
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <List>
                  {activeDeliveries.map((delivery) => (
                    <Card key={delivery.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              Commande #{delivery.order_id}
                            </Typography>
                            
                            <Typography variant="body1" gutterBottom>
                              {delivery.customer}
                            </Typography>
                            
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              📍 {delivery.address}
                            </Typography>
                            
                            <Typography variant="body2" gutterBottom>
                              📞 {delivery.phone}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Chip 
                                label={getStatusText(delivery.status)} 
                                color={getStatusColor(delivery.status)}
                                icon={getStatusIcon(delivery.status)}
                              />
                              <Typography variant="h6" color="primary">
                                {delivery.total} FCFA
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                          {delivery.status === 'accepted' && (
                            <Button
                              variant="contained"
                              startIcon={<DirectionsCar />}
                              onClick={() => handleStartDelivery(delivery.id)}
                              fullWidth
                            >
                              Démarrer la Livraison
                            </Button>
                          )}
                          
                          {delivery.status === 'in_progress' && (
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<CheckCircle />}
                              onClick={() => handleCompleteDelivery(delivery.id)}
                              fullWidth
                            >
                              Marquer comme Livrée
                            </Button>
                          )}
                        </Box>
                        
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                          Acceptée le: {delivery.accepted_at}
                          {delivery.started_at && ` • Début: ${delivery.started_at}`}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </List>
              )}
            </Box>
          )}

          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Historique des Livraisons
              </Typography>
              {completedDeliveries.length === 0 ? (
                <Card>
                  <CardContent sx={{ textAlign: 'center', py: 6 }}>
                    <History sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="textSecondary">
                      Aucune livraison terminée
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Votre historique apparaîtra ici
                    </Typography>
                  </CardContent>
                </Card>
              ) : (
                <List>
                  {completedDeliveries.map((delivery) => (
                    <Card key={delivery.id} sx={{ mb: 2 }}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="h6" gutterBottom>
                              Commande #{delivery.order_id}
                            </Typography>
                            
                            <Typography variant="body1" gutterBottom>
                              {delivery.customer}
                            </Typography>
                            
                            <Typography variant="body2" color="textSecondary" gutterBottom>
                              📍 {delivery.address}
                            </Typography>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
                              <Chip 
                                label={getStatusText(delivery.status)} 
                                color={getStatusColor(delivery.status)}
                                icon={getStatusIcon(delivery.status)}
                              />
                              <Typography variant="h6" color="primary">
                                {delivery.total} FCFA
                              </Typography>
                            </Box>
                          </Box>
                        </Box>
                        
                        <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                          Livrée le: {delivery.completed_at}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
                </List>
              )}
            </Box>
          )}

          {activeTab === 3 && (
            <Box>
              <Typography variant="h5" gutterBottom>
                Mon Profil Livreur
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Informations Personnelles
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Nom: {user?.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Email: {user?.email}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Téléphone: {user?.phone}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Adresse: {user?.address}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Card>
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        Statistiques du Mois
                      </Typography>
                      <Typography variant="body2">
                        🚚 Livraisons effectuées: 24
                      </Typography>
                      <Typography variant="body2">
                        💰 Revenus totaux: 45K FCFA
                      </Typography>
                      <Typography variant="body2">
                        ⭐ Note moyenne: 4.8/5
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

export default DeliveryDashboard