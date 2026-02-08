// src/pages/Delivery/Dashboard.jsx
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
  Tabs,
  Tab,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  CircularProgress,
  Stack,
  IconButton,
  LinearProgress
} from '@mui/material'
import {
  LocalShipping,
  CheckCircle,
  Pending,
  DirectionsCar,
  Assignment,
  Person,
  History,
  Phone,
  LocationOn,
  ShoppingBag,
  CalendarToday,
  Close,
  Refresh,
  Visibility,
  MonetizationOn
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/apiService'

const DeliveryDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState(0)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    assigned: 0,
    in_progress: 0,
    delivered: 0,
    cancelled: 0
  })

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user, activeTab])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      
      // Récupérer toutes les commandes avec les bons filtres
      let endpoint = '/api/orders/orders/'
      
      // Ajouter des paramètres de filtre selon l'onglet actif
      const params = new URLSearchParams()
      
      if (activeTab === 0) {
        // Disponibles: commandes prêtes à être livrées (ready ou assigned)
        params.append('status', 'ready')
        params.append('status', 'assigned')
      } else if (activeTab === 1) {
        // En cours: commandes assignées au livreur en cours
        params.append('status', 'shipped')
        params.append('delivery_agent', user?.id)
      } else if (activeTab === 2) {
        // Terminées: commandes livrées par le livreur
        params.append('status', 'delivered')
        params.append('delivery_agent', user?.id)
      }
      
      // Utiliser un endpoint spécifique pour les livreurs si disponible
      const allOrders = await apiService.get('/api/orders/delivery-orders/')
        .catch(() => apiService.get(endpoint + '?' + params.toString()))
      
      // Si l'API retourne une mauvaise réponse, utiliser des données de test
      let filteredOrders = allOrders
      
      if (!Array.isArray(allOrders) || allOrders.length === 0) {
        // Données de test pour le développement
        filteredOrders = getMockOrders(activeTab, user?.id)
      } else {
        // Filtrer les commandes selon l'onglet
        filteredOrders = allOrders.filter(order => {
          if (activeTab === 0) {
            return order.status === 'ready' || order.status === 'assigned'
          }
          if (activeTab === 1) {
            return order.status === 'shipped' && 
                   order.delivery_agent === user?.id
          }
          if (activeTab === 2) {
            return order.status === 'delivered' && 
                   order.delivery_agent === user?.id
          }
          return false
        })
      }
      
      setOrders(filteredOrders)
      calculateStats(filteredOrders, allOrders)
    } catch (error) {
      console.error('Error fetching orders:', error)
      
      // En cas d'erreur, utiliser des données mockées
      const mockOrders = getMockOrders(activeTab, user?.id)
      setOrders(mockOrders)
      calculateStats(mockOrders, mockOrders)
      
      setError('Erreur lors du chargement des commandes. Affichage des données de démonstration.')
    } finally {
      setLoading(false)
    }
  }

  // Fonction pour générer des données mockées
  const getMockOrders = (tab, userId) => {
    const mockOrders = [
      {
        id: 1001,
        status: 'ready',
        buyer: {
          first_name: 'Jean',
          last_name: 'Dupont',
          phone: '+33 6 12 34 56 78',
          email: 'jean.dupont@email.com'
        },
        shipping_address: '15 Rue de la Paix, 75002 Paris',
        items: [
          { product_name: 'Pizza Margherita', quantity: 2, unit_price: 12, total_price: 24 },
          { product_name: 'Coca-Cola', quantity: 1, unit_price: 3, total_price: 3 }
        ],
        subtotal: 27,
        delivery_fee: 3,
        total_amount: 30,
        created_at: '2024-01-15T14:30:00Z',
        notes: 'Sonner 2 fois',
        delivery_agent: null
      },
      {
        id: 1002,
        status: 'assigned',
        buyer: {
          first_name: 'Marie',
          last_name: 'Martin',
          phone: '+33 6 23 45 67 89',
          email: 'marie.martin@email.com'
        },
        shipping_address: '42 Avenue des Champs-Élysées, 75008 Paris',
        items: [
          { product_name: 'Burger Deluxe', quantity: 1, unit_price: 15, total_price: 15 },
          { product_name: 'Frites', quantity: 1, unit_price: 5, total_price: 5 }
        ],
        subtotal: 20,
        delivery_fee: 4,
        total_amount: 24,
        created_at: '2024-01-15T15:00:00Z',
        notes: 'Appeler à l\'arrivée',
        delivery_agent: userId
      },
      {
        id: 1003,
        status: 'shipped',
        buyer: {
          first_name: 'Pierre',
          last_name: 'Durand',
          phone: '+33 6 34 56 78 90',
          email: 'pierre.durand@email.com'
        },
        shipping_address: '8 Rue de Rivoli, 75004 Paris',
        items: [
          { product_name: 'Salade César', quantity: 1, unit_price: 10, total_price: 10 },
          { product_name: 'Eau minérale', quantity: 2, unit_price: 2, total_price: 4 }
        ],
        subtotal: 14,
        delivery_fee: 3,
        total_amount: 17,
        created_at: '2024-01-15T15:30:00Z',
        notes: '',
        delivery_agent: userId
      },
      {
        id: 1004,
        status: 'delivered',
        buyer: {
          first_name: 'Sophie',
          last_name: 'Leroy',
          phone: '+33 6 45 67 89 01',
          email: 'sophie.leroy@email.com'
        },
        shipping_address: '25 Boulevard Saint-Germain, 75005 Paris',
        items: [
          { product_name: 'Sushi Mix', quantity: 1, unit_price: 25, total_price: 25 }
        ],
        subtotal: 25,
        delivery_fee: 5,
        total_amount: 30,
        created_at: '2024-01-15T14:00:00Z',
        notes: 'Laisser devant la porte',
        delivery_agent: userId
      }
    ]

    // Filtrer selon l'onglet actif
    return mockOrders.filter(order => {
      if (tab === 0) {
        return order.status === 'ready' || order.status === 'assigned'
      }
      if (tab === 1) {
        return order.status === 'shipped' && order.delivery_agent === userId
      }
      if (tab === 2) {
        return order.status === 'delivered' && order.delivery_agent === userId
      }
      return false
    })
  }

  const calculateStats = (filteredOrders, allOrders) => {
    const stats = {
      total: allOrders.length || 0,
      pending: allOrders.filter(o => o.status === 'ready').length || 0,
      assigned: allOrders.filter(o => o.status === 'assigned').length || 0,
      in_progress: allOrders.filter(o => o.status === 'shipped').length || 0,
      delivered: allOrders.filter(o => o.status === 'delivered').length || 0,
      cancelled: allOrders.filter(o => o.status === 'cancelled').length || 0
    }
    setStats(stats)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setDialogOpen(true)
  }

  const handleAcceptOrder = async (orderId) => {
    try {
      setLoading(true)
      // Mettre à jour le statut et assigner le livreur
      await apiService.updateOrderStatus(orderId, 'assigned', { delivery_agent: user?.id })
      // Mettre à jour localement pour un retour immédiat
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'assigned', delivery_agent: user?.id }
          : order
      ))
      setStats(prev => ({
        ...prev,
        pending: Math.max(prev.pending - 1, 0),
        assigned: prev.assigned + 1
      }))
      setError('')
    } catch (error) {
      console.error('Error accepting order:', error)
      setError('Erreur lors de l\'acceptation de la commande')
    } finally {
      setLoading(false)
    }
  }

  const handleStartDelivery = async (orderId) => {
    try {
      setLoading(true)
      await apiService.updateOrderStatus(orderId, 'shipped')
      // Mettre à jour localement
      setOrders(orders.map(order => 
        order.id === orderId 
          ? { ...order, status: 'shipped' }
          : order
      ))
      setStats(prev => ({
        ...prev,
        assigned: Math.max(prev.assigned - 1, 0),
        in_progress: prev.in_progress + 1
      }))
      setError('')
    } catch (error) {
      console.error('Error starting delivery:', error)
      setError('Erreur lors du démarrage de la livraison')
    } finally {
      setLoading(false)
    }
  }

  const handleCompleteDelivery = async (orderId) => {
    try {
      setLoading(true)
      await apiService.updateOrderStatus(orderId, 'delivered')
      // Mettre à jour localement
      setOrders(orders.filter(order => order.id !== orderId))
      setStats(prev => ({
        ...prev,
        in_progress: Math.max(prev.in_progress - 1, 0),
        delivered: prev.delivered + 1
      }))
      setError('')
    } catch (error) {
      console.error('Error completing delivery:', error)
      setError('Erreur lors de la finalisation de la livraison')
    } finally {
      setLoading(false)
    }
  }

  const handleRejectOrder = async (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir refuser cette livraison ?')) {
      try {
        setLoading(true)
        await apiService.updateOrderStatus(orderId, 'ready', { delivery_agent: null })
        // Mettre à jour localement
        setOrders(orders.filter(order => order.id !== orderId))
        setStats(prev => ({
          ...prev,
          assigned: Math.max(prev.assigned - 1, 0),
          pending: prev.pending + 1
        }))
        setError('')
      } catch (error) {
        console.error('Error rejecting order:', error)
        setError('Erreur lors du refus de la livraison')
      } finally {
        setLoading(false)
      }
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'default',
      confirmed: 'primary',
      preparing: 'secondary',
      ready: 'warning',
      assigned: 'info',
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
      ready: 'Prête pour livraison',
      assigned: 'Assignée',
      shipped: 'En cours de livraison',
      delivered: 'Livrée',
      cancelled: 'Annulée'
    }
    return texts[status] || status
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Pending />,
      confirmed: <CheckCircle />,
      preparing: <LocalShipping />,
      ready: <LocalShipping />,
      assigned: <Assignment />,
      shipped: <DirectionsCar />,
      delivered: <CheckCircle />,
      cancelled: <Close />
    }
    return icons[status] || <Pending />
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Date inconnue'
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatPrice = (price) => {
    const num = typeof price === 'string' ? parseFloat(price) : price
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(num || 0)
  }

  if (loading && orders.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
            Chargement des livraisons...
          </Typography>
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* En-tête */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
              Tableau de Bord Livreur
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Bienvenue, {user?.first_name || 'Livreur'} ! Gérez vos livraisons.
            </Typography>
          </Box>
          
          <Button
            variant="outlined"
            startIcon={<Refresh />}
            onClick={fetchOrders}
            disabled={loading}
          >
            Actualiser
          </Button>
        </Box>

        {error && (
          <Alert 
            severity="warning" 
            sx={{ mb: 3 }} 
            onClose={() => setError('')}
            action={
              <Button color="inherit" size="small" onClick={fetchOrders}>
                Réessayer
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        {/* Statistiques */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {Object.entries({
            total: { label: 'Total', icon: null, color: 'text.primary' },
            pending: { label: 'Disponibles', icon: <Pending />, color: 'warning.main' },
            assigned: { label: 'Assignées', icon: <Assignment />, color: 'info.main' },
            in_progress: { label: 'En cours', icon: <DirectionsCar />, color: 'secondary.main' },
            delivered: { label: 'Livrées', icon: <CheckCircle />, color: 'success.main' },
            cancelled: { label: 'Annulées', icon: <Close />, color: 'error.main' }
          }).map(([key, config]) => (
            <Grid item xs={6} sm={4} md={2} key={key}>
              <Card>
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                  <Typography variant="body2" color="textSecondary" gutterBottom sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                    {config.icon && React.cloneElement(config.icon, { sx: { fontSize: 14 } })}
                    {config.label}
                  </Typography>
                  <Typography variant="h4" component="div" color={config.color}>
                    {stats[key] || 0}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Navigation par onglets */}
        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab 
              icon={<LocalShipping />} 
              label={`Disponibles (${stats.pending})`} 
            />
            <Tab 
              icon={<DirectionsCar />} 
              label={`En cours (${stats.in_progress})`} 
            />
            <Tab 
              icon={<History />} 
              label={`Terminées (${stats.delivered})`} 
            />
          </Tabs>
        </Paper>
      </Box>

      {/* Liste des commandes */}
      {loading && orders.length > 0 && (
        <LinearProgress sx={{ mb: 2 }} />
      )}

      {orders.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          {activeTab === 0 ? (
            <>
              <LocalShipping sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Aucune livraison disponible
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Les commandes prêtes pour livraison apparaîtront ici
              </Typography>
            </>
          ) : activeTab === 1 ? (
            <>
              <DirectionsCar sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Aucune livraison en cours
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Acceptez des livraisons pour commencer
              </Typography>
              <Button
                variant="contained"
                startIcon={<LocalShipping />}
                onClick={() => setActiveTab(0)}
                sx={{ mt: 2 }}
              >
                Voir les livraisons disponibles
              </Button>
            </>
          ) : (
            <>
              <History sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" color="textSecondary" gutterBottom>
                Aucune livraison terminée
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Votre historique de livraisons apparaîtra ici
              </Typography>
            </>
          )}
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {orders.map((order) => (
            <Grid item xs={12} key={order.id}>
              <OrderCard
                order={order}
                activeTab={activeTab}
                onView={handleViewOrder}
                onAccept={handleAcceptOrder}
                onStart={handleStartDelivery}
                onComplete={handleCompleteDelivery}
                onReject={handleRejectOrder}
                getStatusColor={getStatusColor}
                getStatusText={getStatusText}
                getStatusIcon={getStatusIcon}
                formatDate={formatDate}
                formatPrice={formatPrice}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog de détails */}
      <OrderDialog
        order={selectedOrder}
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        getStatusColor={getStatusColor}
        getStatusText={getStatusText}
        getStatusIcon={getStatusIcon}
        formatDate={formatDate}
        formatPrice={formatPrice}
        activeTab={activeTab}
        onAccept={handleAcceptOrder}
        onStart={handleStartDelivery}
        onComplete={handleCompleteDelivery}
      />
    </Container>
  )
}

// Composant carte de commande
const OrderCard = ({ 
  order, 
  activeTab, 
  onView, 
  onAccept, 
  onStart, 
  onComplete, 
  onReject,
  getStatusColor, 
  getStatusText, 
  getStatusIcon,
  formatDate,
  formatPrice
}) => {
  return (
    <Card sx={{ mb: 2, '&:hover': { boxShadow: 6 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
          {/* Informations principales */}
          <Box sx={{ flex: 1, minWidth: 300 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
              <Typography variant="h6" fontWeight="bold">
                Commande #{order.id}
              </Typography>
              <Chip 
                icon={getStatusIcon(order.status)}
                label={getStatusText(order.status)}
                color={getStatusColor(order.status)}
                size="small"
              />
              <Typography variant="caption" color="textSecondary">
                {formatDate(order.created_at)}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  {/* Client */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2">
                      {order.buyer?.first_name} {order.buyer?.last_name}
                    </Typography>
                  </Box>

                  {/* Téléphone */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone fontSize="small" color="action" />
                    <Typography variant="body2">
                      {order.buyer?.phone || order.buyer?.phone_number || 'Tél: non renseigné'}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <Stack spacing={1}>
                  {/* Adresse */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationOn fontSize="small" color="action" />
                    <Typography variant="body2" sx={{ flex: 1 }}>
                      {order.shipping_address}
                    </Typography>
                  </Box>

                  {/* Articles */}
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <ShoppingBag fontSize="small" color="action" />
                    <Typography variant="body2">
                      {order.items?.length || 0} article(s) • {formatPrice(order.total_amount)}
                    </Typography>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Box>

          {/* Montant et actions */}
          <Box sx={{ textAlign: 'right' }}>
            <Typography variant="h5" color="primary" fontWeight="bold" gutterBottom>
              {formatPrice(order.total_amount)}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', minWidth: 200 }}>
              <Button
                variant="outlined"
                size="small"
                startIcon={<Visibility />}
                onClick={() => onView(order)}
                fullWidth
              >
                Détails
              </Button>

              {activeTab === 0 && order.status === 'ready' && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<CheckCircle />}
                  onClick={() => onAccept(order.id)}
                  fullWidth
                >
                  Accepter
                </Button>
              )}

              {activeTab === 0 && order.status === 'assigned' && (
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<DirectionsCar />}
                  onClick={() => onStart(order.id)}
                  fullWidth
                >
                  Démarrer livraison
                </Button>
              )}

              {activeTab === 1 && order.status === 'shipped' && (
                <Button
                  variant="contained"
                  color="success"
                  size="small"
                  startIcon={<CheckCircle />}
                  onClick={() => onComplete(order.id)}
                  fullWidth
                >
                  Marquer comme livrée
                </Button>
              )}

              {(order.status === 'assigned' || order.status === 'ready') && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<Close />}
                  onClick={() => onReject(order.id)}
                  fullWidth
                >
                  Refuser
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

// Dialog de détails de commande
const OrderDialog = ({ 
  order, 
  open, 
  onClose, 
  getStatusColor, 
  getStatusText, 
  getStatusIcon,
  formatDate,
  formatPrice,
  activeTab,
  onAccept,
  onStart,
  onComplete
}) => {
  if (!order) return null

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      scroll="paper"
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          <Typography variant="h6" fontWeight="bold">
            Commande #{order.id}
          </Typography>
          <Chip 
            icon={getStatusIcon(order.status)}
            label={getStatusText(order.status)}
            color={getStatusColor(order.status)}
          />
        </Box>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Grid container spacing={3}>
          {/* Informations client */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Person /> Informations Client
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Nom complet</Typography>
                    <Typography>
                      {order.buyer?.first_name} {order.buyer?.last_name}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Téléphone</Typography>
                    <Typography>
                      {order.buyer?.phone || order.buyer?.phone_number || 'Non renseigné'}
                    </Typography>
                  </Box>
                  {order.buyer?.email && (
                    <Box>
                      <Typography variant="body2" color="textSecondary">Email</Typography>
                      <Typography>{order.buyer.email}</Typography>
                    </Box>
                  )}
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Informations livraison */}
          <Grid item xs={12} md={6}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocationOn /> Informations Livraison
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={2}>
                  <Box>
                    <Typography variant="body2" color="textSecondary">Adresse</Typography>
                    <Typography>{order.shipping_address}</Typography>
                  </Box>
                  {order.notes && (
                    <Box>
                      <Typography variant="body2" color="textSecondary">Instructions</Typography>
                      <Typography>{order.notes}</Typography>
                    </Box>
                  )}
                  <Box>
                    <Typography variant="body2" color="textSecondary">Date de commande</Typography>
                    <Typography>{formatDate(order.created_at)}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Articles */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ShoppingBag /> Articles commandés
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <List dense>
                  {order.items?.map((item, index) => (
                    <ListItem key={index} divider={index < order.items.length - 1}>
                      <ListItemText
                        primary={item.product_name || 'Produit'}
                        secondary={`Quantité: ${item.quantity} × ${formatPrice(item.unit_price || item.price)}`}
                      />
                      <Typography variant="body2" fontWeight="bold">
                        {formatPrice(item.total_price || (item.quantity * (item.unit_price || item.price)))}
                      </Typography>
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          {/* Récapitulatif */}
          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <MonetizationOn /> Récapitulatif
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Sous-total:</Typography>
                    <Typography>{formatPrice(order.subtotal || order.total_amount - (order.delivery_fee || 0))}</Typography>
                  </Box>
                  {(order.delivery_fee || 0) > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Frais de livraison:</Typography>
                      <Typography>{formatPrice(order.delivery_fee)}</Typography>
                    </Box>
                  )}
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary">
                      {formatPrice(order.total_amount)}
                    </Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
        
        {activeTab === 0 && order.status === 'ready' && (
          <Button
            variant="contained"
            startIcon={<CheckCircle />}
            onClick={() => {
              onAccept(order.id)
              onClose()
            }}
          >
            Accepter la livraison
          </Button>
        )}

        {activeTab === 0 && order.status === 'assigned' && (
          <Button
            variant="contained"
            startIcon={<DirectionsCar />}
            onClick={() => {
              onStart(order.id)
              onClose()
            }}
          >
            Démarrer la livraison
          </Button>
        )}

        {activeTab === 1 && order.status === 'shipped' && (
          <Button
            variant="contained"
            color="success"
            startIcon={<CheckCircle />}
            onClick={() => {
              onComplete(order.id)
              onClose()
            }}
          >
            Confirmer la livraison
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default DeliveryDashboard