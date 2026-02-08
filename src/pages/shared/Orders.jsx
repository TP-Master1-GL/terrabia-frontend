// src/pages/Customer/Orders.jsx
import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Alert,
  CircularProgress,
  Stack,
  Badge,
  IconButton,
  Tabs,
  Tab
} from '@mui/material'
import {
  Visibility,
  LocalShipping,
  CheckCircle,
  Schedule,
  AssignmentReturned,
  Cancel,
  Refresh,
  ShoppingBag,
  Person,
  Phone,
  Email,
  LocationOn,
  CalendarToday
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import apiService from '../../services/apiService'

const Orders = () => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [updatingStatus, setUpdatingStatus] = useState(null)

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError('')
      
      let ordersData = []
      if (user?.role === 'farmer') {
        // Pour les agriculteurs
        ordersData = await apiService.getFarmerOrders()
      } else {
        // Pour les acheteurs
        ordersData = await apiService.getOrders()
      }
      
      setOrders(Array.isArray(ordersData) ? ordersData : [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      setError(error.message || 'Erreur lors du chargement des commandes')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'default',
      confirmed: 'primary',
      preparing: 'secondary',
      ready: 'warning',
      shipped: 'info',
      delivered: 'success',
      cancelled: 'error',
      completed: 'success'
    }
    return colors[status] || 'default'
  }

  const getStatusText = (status) => {
    const texts = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      preparing: 'En préparation',
      ready: 'Prête',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
      completed: 'Terminée'
    }
    return texts[status] || status
  }

  const getStatusIcon = (status) => {
    const icons = {
      pending: <Schedule color="action" />,
      confirmed: <CheckCircle color="primary" />,
      preparing: <LocalShipping color="secondary" />,
      ready: <LocalShipping color="warning" />,
      shipped: <LocalShipping color="info" />,
      delivered: <CheckCircle color="success" />,
      cancelled: <Cancel color="error" />
    }
    return icons[status] || <Schedule color="action" />
  }

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
    setDialogOpen(true)
  }

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(orderId)
      await apiService.updateOrderStatus(orderId, newStatus)
      // Rafraîchir la liste
      await fetchOrders()
    } catch (error) {
      console.error('Error updating order status:', error)
      setError('Erreur lors de la mise à jour du statut')
    } finally {
      setUpdatingStatus(null)
    }
  }

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Êtes-vous sûr de vouloir annuler cette commande ?')) {
      try {
        await handleUpdateStatus(orderId, 'cancelled')
      } catch (error) {
        console.error('Error cancelling order:', error)
      }
    }
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
    return parseFloat(price || 0).toLocaleString('fr-FR') + ' FCFA'
  }

  // Filtrer les commandes par statut
  const filteredOrders = orders.filter(order => {
    if (activeTab === 0) return true // Toutes
    if (activeTab === 1) return order.status === 'pending' || order.status === 'confirmed'
    if (activeTab === 2) return order.status === 'preparing' || order.status === 'ready'
    if (activeTab === 3) return order.status === 'shipped' || order.status === 'delivered'
    if (activeTab === 4) return order.status === 'cancelled'
    return true
  })

  const tabLabels = user?.role === 'farmer' 
    ? ['Toutes', 'À traiter', 'En préparation', 'En livraison', 'Annulées']
    : ['Toutes', 'En cours', 'En préparation', 'En livraison', 'Annulées']

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="60vh">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" sx={{ mt: 3, color: 'text.secondary' }}>
            Chargement des commandes...
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
              {user?.role === 'farmer' ? 'Commandes Reçues' : 'Mes Commandes'}
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {user?.role === 'farmer' 
                ? 'Gérez les commandes de vos clients' 
                : 'Suivez l\'état de vos commandes'
              }
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
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {/* Tabs pour filtrer */}
        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {tabLabels.map((label, index) => (
              <Tab 
                key={index} 
                label={label}
                icon={
                  <Badge 
                    badgeContent={orders.filter(order => {
                      if (index === 0) return true
                      if (index === 1) return order.status === 'pending' || order.status === 'confirmed'
                      if (index === 2) return order.status === 'preparing' || order.status === 'ready'
                      if (index === 3) return order.status === 'shipped' || order.status === 'delivered'
                      if (index === 4) return order.status === 'cancelled'
                      return false
                    }).length}
                    color="primary"
                    max={99}
                  />
                }
                iconPosition="end"
              />
            ))}
          </Tabs>
        </Paper>
      </Box>

      {/* Liste des commandes */}
      {filteredOrders.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <ShoppingBag sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Aucune commande {activeTab > 0 ? 'dans cette catégorie' : ''}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user?.role === 'farmer' 
              ? 'Les commandes de vos clients apparaîtront ici' 
              : 'Vos commandes apparaîtront ici'
            }
          </Typography>
        </Paper>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Commande</TableCell>
                <TableCell>Date</TableCell>
                {user?.role === 'farmer' && <TableCell>Client</TableCell>}
                {user?.role === 'customer' && <TableCell>Agriculteur</TableCell>}
                <TableCell>Articles</TableCell>
                <TableCell>Montant</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Commande #{order.id || order.order_number}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      ID: {order.id}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Stack spacing={0.5}>
                      <Typography variant="body2">
                        {formatDate(order.created_at || order.date)}
                      </Typography>
                      {order.updated_at && order.updated_at !== order.created_at && (
                        <Typography variant="caption" color="textSecondary">
                          Modifié: {formatDate(order.updated_at)}
                        </Typography>
                      )}
                    </Stack>
                  </TableCell>
                  
                  <TableCell>
                    {user?.role === 'farmer' ? (
                      <Stack spacing={0.5}>
                        <Typography variant="body2">
                          {order.buyer?.first_name} {order.buyer?.last_name}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {order.buyer?.phone || order.buyer?.phone_number || 'Tél: non renseigné'}
                        </Typography>
                      </Stack>
                    ) : (
                      <Stack spacing={0.5}>
                        <Typography variant="body2">
                          {order.farmer?.farm_name || order.farmer?.username || 'Agriculteur'}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {order.farmer?.city || 'Localisation inconnue'}
                        </Typography>
                      </Stack>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {order.items?.length || 0} article(s)
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {order.items?.slice(0, 2).map(item => item.product_name).join(', ')}
                      {order.items?.length > 2 && '...'}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {formatPrice(order.total_amount || order.total)}
                    </Typography>
                    {order.delivery_fee > 0 && (
                      <Typography variant="caption" color="textSecondary">
                        Livraison: {formatPrice(order.delivery_fee)}
                      </Typography>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Chip 
                      icon={getStatusIcon(order.status)}
                      label={getStatusText(order.status)}
                      color={getStatusColor(order.status)}
                      size="small"
                      variant="outlined"
                    />
                    {order.delivery_agent && (
                      <Typography variant="caption" display="block" color="textSecondary">
                        Livreur: {order.delivery_agent.name}
                      </Typography>
                    )}
                  </TableCell>
                  
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<Visibility />}
                        onClick={() => handleViewOrder(order)}
                      >
                        Détails
                      </Button>
                      
                      {user?.role === 'farmer' && order.status === 'confirmed' && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={updatingStatus === order.id ? <CircularProgress size={16} /> : <LocalShipping />}
                          onClick={() => handleUpdateStatus(order.id, 'preparing')}
                          disabled={updatingStatus === order.id}
                        >
                          Préparer
                        </Button>
                      )}
                      
                      {user?.role === 'farmer' && order.status === 'preparing' && (
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={updatingStatus === order.id ? <CircularProgress size={16} /> : <CheckCircle />}
                          onClick={() => handleUpdateStatus(order.id, 'ready')}
                          disabled={updatingStatus === order.id}
                        >
                          Prête
                        </Button>
                      )}
                      
                      {user?.role === 'customer' && 
                       (order.status === 'pending' || order.status === 'confirmed') && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<Cancel />}
                          onClick={() => handleCancelOrder(order.id)}
                        >
                          Annuler
                        </Button>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog de détails de commande */}
      <Dialog 
        open={dialogOpen} 
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle>
          Détails de la commande #{selectedOrder?.id}
        </DialogTitle>
        <DialogContent dividers>
          {selectedOrder && (
            <Box>
              {/* Informations générales */}
              <Paper sx={{ p: 2, mb: 3, bgcolor: 'grey.50' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="textSecondary">
                        <CalendarToday sx={{ fontSize: 14, mr: 1, verticalAlign: 'middle' }} />
                        Date de commande
                      </Typography>
                      <Typography>
                        {formatDate(selectedOrder.created_at)}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Statut
                      </Typography>
                      <Chip 
                        icon={getStatusIcon(selectedOrder.status)}
                        label={getStatusText(selectedOrder.status)}
                        color={getStatusColor(selectedOrder.status)}
                      />
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              {/* Informations client/agriculteur */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {user?.role === 'farmer' ? 'Informations client' : 'Informations agriculteur'}
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="textSecondary">
                        <Person sx={{ fontSize: 14, mr: 1, verticalAlign: 'middle' }} />
                        Nom
                      </Typography>
                      <Typography>
                        {user?.role === 'farmer' 
                          ? `${selectedOrder.buyer?.first_name || ''} ${selectedOrder.buyer?.last_name || ''}`
                          : selectedOrder.farmer?.farm_name || selectedOrder.farmer?.username || 'Non spécifié'
                        }
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Stack spacing={1}>
                      <Typography variant="body2" color="textSecondary">
                        <Phone sx={{ fontSize: 14, mr: 1, verticalAlign: 'middle' }} />
                        Téléphone
                      </Typography>
                      <Typography>
                        {user?.role === 'farmer' 
                          ? selectedOrder.buyer?.phone || selectedOrder.buyer?.phone_number || 'Non renseigné'
                          : selectedOrder.farmer?.phone || selectedOrder.farmer?.phone_number || 'Non renseigné'
                        }
                      </Typography>
                    </Stack>
                  </Grid>
                  {user?.role === 'farmer' && selectedOrder.buyer?.email && (
                    <Grid item xs={12}>
                      <Stack spacing={1}>
                        <Typography variant="body2" color="textSecondary">
                          <Email sx={{ fontSize: 14, mr: 1, verticalAlign: 'middle' }} />
                          Email
                        </Typography>
                        <Typography>
                          {selectedOrder.buyer.email}
                        </Typography>
                      </Stack>
                    </Grid>
                  )}
                </Grid>
              </Paper>

              {/* Adresse de livraison */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  <LocationOn sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Adresse de livraison
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Typography>
                  {selectedOrder.shipping_address || 'Adresse non spécifiée'}
                </Typography>
                {selectedOrder.notes && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="body2" color="textSecondary">
                      Instructions:
                    </Typography>
                    <Typography variant="body2">
                      {selectedOrder.notes}
                    </Typography>
                  </Box>
                )}
              </Paper>

              {/* Articles commandés */}
              <Paper sx={{ p: 2, mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Articles commandés
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Produit</TableCell>
                        <TableCell align="center">Quantité</TableCell>
                        <TableCell align="right">Prix unitaire</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {selectedOrder.items?.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography>{item.product_name || item.product?.name || 'Produit'}</Typography>
                            {item.product_description && (
                              <Typography variant="caption" color="textSecondary">
                                {item.product_description}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            {item.quantity}
                          </TableCell>
                          <TableCell align="right">
                            {formatPrice(item.unit_price || item.price)}
                          </TableCell>
                          <TableCell align="right">
                            <Typography fontWeight="bold">
                              {formatPrice(item.total_price || (item.quantity * (item.unit_price || item.price)))}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>

              {/* Récapitulatif des prix */}
              <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Récapitulatif
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Stack spacing={1}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography>Sous-total:</Typography>
                    <Typography>{formatPrice(selectedOrder.subtotal || selectedOrder.total_amount - (selectedOrder.delivery_fee || 0))}</Typography>
                  </Box>
                  {selectedOrder.delivery_fee > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography>Livraison:</Typography>
                      <Typography>{formatPrice(selectedOrder.delivery_fee)}</Typography>
                    </Box>
                  )}
                  <Divider />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary">
                      {formatPrice(selectedOrder.total_amount || selectedOrder.total)}
                    </Typography>
                  </Box>
                </Stack>
              </Paper>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>
            Fermer
          </Button>
          {user?.role === 'farmer' && selectedOrder?.status === 'confirmed' && (
            <Button 
              variant="contained" 
              onClick={() => {
                handleUpdateStatus(selectedOrder.id, 'preparing')
                setDialogOpen(false)
              }}
            >
              Commencer la préparation
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Container>
  )
}

// Note: Assurez-vous d'importer Grid si ce n'est pas déjà fait
import { Grid } from '@mui/material'

export default Orders