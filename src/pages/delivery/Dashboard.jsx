// pages/delivery/Dashboard.jsx
import React, { useState, useEffect } from 'react'
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
  Tabs,
  Tab,
  Alert
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
import { authAPI } from '../../services/api'

const DeliveryDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [deliveries, setDeliveries] = useState([])
  const [stats, setStats] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDeliveries()
    loadStats()
  }, [activeTab])

  const loadDeliveries = async () => {
    try {
      setLoading(true)
      const response = await deliveryAPI.getDeliveries()
      setDeliveries(response.data)
    } catch (err) {
      setError('Erreur lors du chargement des livraisons')
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const response = await deliveryAPI.getStats()
      setStats(response.data)
    } catch (err) {
      // Utiliser des stats par défaut si l'API n'est pas disponible
      setStats({
        total: deliveries.length,
        pending: deliveries.filter(d => d.status === 'pending').length,
        active: deliveries.filter(d => ['accepted', 'in_progress'].includes(d.status)).length,
        completed: deliveries.filter(d => d.status === 'completed').length
      })
    }
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleAcceptDelivery = async (deliveryId) => {
    try {
      await deliveryAPI.acceptDelivery(deliveryId)
      await loadDeliveries() // Recharger les données
      setError('')
    } catch (err) {
      setError('Erreur lors de l\'acceptation de la livraison')
    }
  }

  const handleStartDelivery = async (deliveryId) => {
    try {
      await deliveryAPI.startDelivery(deliveryId)
      await loadDeliveries()
      setError('')
    } catch (err) {
      setError('Erreur lors du démarrage de la livraison')
    }
  }

  const handleCompleteDelivery = async (deliveryId) => {
    try {
      await deliveryAPI.completeDelivery(deliveryId)
      await loadDeliveries()
      setError('')
    } catch (err) {
      setError('Erreur lors de la finalisation de la livraison')
    }
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
          Bienvenue, {user?.first_name} ! Gérez vos livraisons.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Livraisons totales
              </Typography>
              <Typography variant="h4" component="div">
                {stats.total || deliveries.length}
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
                {stats.pending || pendingDeliveries.length}
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
                {stats.active || activeDeliveries.length}
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
                {stats.completed || completedDeliveries.length}
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
            <DeliveryTab
              deliveries={pendingDeliveries}
              title="Livraisons en attente"
              emptyMessage="Aucune livraison en attente"
              actionButton={{
                text: 'Accepter la Livraison',
                icon: <CheckCircle />,
                onClick: handleAcceptDelivery
              }}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getStatusIcon={getStatusIcon}
            />
          )}

          {activeTab === 1 && (
            <DeliveryTab
              deliveries={activeDeliveries}
              title="Livraisons en cours"
              emptyMessage="Aucune livraison en cours"
              actionButtons={[
                {
                  text: 'Démarrer la Livraison',
                  icon: <DirectionsCar />,
                  onClick: handleStartDelivery,
                  show: (delivery) => delivery.status === 'accepted'
                },
                {
                  text: 'Marquer comme Livrée',
                  icon: <CheckCircle />,
                  onClick: handleCompleteDelivery,
                  show: (delivery) => delivery.status === 'in_progress'
                }
              ]}
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getStatusIcon={getStatusIcon}
            />
          )}

          {activeTab === 2 && (
            <DeliveryTab
              deliveries={completedDeliveries}
              title="Historique des Livraisons"
              emptyMessage="Aucune livraison terminée"
              getStatusColor={getStatusColor}
              getStatusText={getStatusText}
              getStatusIcon={getStatusIcon}
            />
          )}

          {activeTab === 3 && (
            <ProfileTab user={user} />
          )}
        </Box>
      </Paper>
    </Container>
  )
}

// Composant réutilisable pour les onglets de livraison
const DeliveryTab = ({ deliveries, title, emptyMessage, actionButton, actionButtons, getStatusColor, getStatusText, getStatusIcon }) => {
  if (deliveries.length === 0) {
    return (
      <Card>
        <CardContent sx={{ textAlign: 'center', py: 6 }}>
          <Pending sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary">
            {emptyMessage}
          </Typography>
        </CardContent>
      </Card>
    )
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <List>
        {deliveries.map((delivery) => (
          <DeliveryCard
            key={delivery.id}
            delivery={delivery}
            actionButton={actionButton}
            actionButtons={actionButtons}
            getStatusColor={getStatusColor}
            getStatusText={getStatusText}
            getStatusIcon={getStatusIcon}
          />
        ))}
      </List>
    </Box>
  )
}

// Composant carte de livraison
const DeliveryCard = ({ delivery, actionButton, actionButtons, getStatusColor, getStatusText, getStatusIcon }) => (
  <Card sx={{ mb: 2 }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" gutterBottom>
            Commande #{delivery.order_id}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
            <Person fontSize="small" color="action" />
            <Typography variant="body1">
              {delivery.customer_name}
            </Typography>
          </Box>
          
          <Typography variant="body2" color="textSecondary" gutterBottom>
            📞 {delivery.customer_phone}
          </Typography>
          
          <Typography variant="body2" color="textSecondary" gutterBottom>
            📍 {delivery.delivery_address}
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            🛒 Articles: {delivery.items?.join(', ') || 'Chargement...'}
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            👨‍🌾 Agriculteur: {delivery.farmer_name}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <Chip 
              label={getStatusText(delivery.status)} 
              color={getStatusColor(delivery.status)}
              icon={getStatusIcon(delivery.status)}
            />
            <Typography variant="h6" color="primary">
              {delivery.total_amount} FCFA
            </Typography>
          </Box>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
        {actionButton && (
          <Button
            variant="contained"
            startIcon={actionButton.icon}
            onClick={() => actionButton.onClick(delivery.id)}
            fullWidth
          >
            {actionButton.text}
          </Button>
        )}
        
        {actionButtons && actionButtons.map((btn, index) => 
          btn.show(delivery) && (
            <Button
              key={index}
              variant="contained"
              startIcon={btn.icon}
              onClick={() => btn.onClick(delivery.id)}
              fullWidth
            >
              {btn.text}
            </Button>
          )
        )}
      </Box>
      
      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
        Créée le: {new Date(delivery.created_at).toLocaleString('fr-FR')}
      </Typography>
    </CardContent>
  </Card>
)

// Composant profil
const ProfileTab = ({ user }) => (
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
              Nom: {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Email: {user?.email}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Téléphone: {user?.phone_number || 'Non renseigné'}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Adresse: {user?.address || 'Non renseignée'}
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
)

export default DeliveryDashboard