import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Alert,
  Card,
  CardContent
} from '@mui/material'
import {
  Add,
  Edit,
  Delete,
  LocalShipping,
  Email,
  Lock
} from '@mui/icons-material'

const DeliveryManagement = () => {
  const [deliveryCompanies, setDeliveryCompanies] = useState([
    {
      id: 1,
      name: 'Express Delivery Cameroun',
      email: 'express@delivery.cm',
      phone: '+237 6 54 32 10 00',
      address: 'Yaoundé, Cameroun',
      status: 'active',
      created_at: '2024-01-15',
      password: 'express123'
    },
    {
      id: 2,
      name: 'Rapid Livraison',
      email: 'rapid@livraison.cm',
      phone: '+237 6 54 32 10 01',
      address: 'Douala, Cameroun',
      status: 'inactive',
      created_at: '2024-01-20',
      password: 'rapid123'
    }
  ])

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleOpenDialog = (company = null) => {
    if (company) {
      setFormData({
        name: company.name,
        email: company.email,
        phone: company.phone,
        address: company.address,
        password: company.password
      })
      setSelectedCompany(company)
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        address: '',
        password: ''
      })
      setSelectedCompany(null)
    }
    setDialogOpen(true)
    setError('')
    setSuccess('')
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setSelectedCompany(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      password: ''
    })
  }

  const handleSubmit = () => {
    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.address || !formData.password) {
      setError('Tous les champs sont obligatoires')
      return
    }

    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }

    if (selectedCompany) {
      // Modification
      setDeliveryCompanies(prev => 
        prev.map(company => 
          company.id === selectedCompany.id 
            ? { ...company, ...formData }
            : company
        )
      )
      setSuccess('Entreprise de livraison modifiée avec succès')
    } else {
      // Création
      const newCompany = {
        id: Date.now(),
        ...formData,
        status: 'active',
        created_at: new Date().toISOString().split('T')[0]
      }
      setDeliveryCompanies(prev => [...prev, newCompany])
      
      // Ajouter aux utilisateurs
      const users = JSON.parse(localStorage.getItem('terrabia_users') || '[]')
      const deliveryUser = {
        id: Date.now() + 1,
        name: formData.name,
        email: formData.email,
        role: 'delivery',
        phone: formData.phone,
        address: formData.address
      }
      users.push(deliveryUser)
      localStorage.setItem('terrabia_users', JSON.stringify(users))
      
      setSuccess('Entreprise de livraison créée avec succès')
    }

    setTimeout(() => {
      handleCloseDialog()
      setSuccess('')
    }, 2000)
  }

  const handleDelete = (company) => {
    setSelectedCompany(company)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    setDeliveryCompanies(prev => prev.filter(company => company.id !== selectedCompany.id))
    setDeleteDialogOpen(false)
    setSelectedCompany(null)
    setSuccess('Entreprise de livraison supprimée avec succès')
    setTimeout(() => setSuccess(''), 3000)
  }

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error'
  }

  const getStatusText = (status) => {
    return status === 'active' ? 'Actif' : 'Inactif'
  }

  return (
    <Box>
      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          {success}
        </Alert>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #3a9a3a 0%, #2a7a2a 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {deliveryCompanies.length}
              </Typography>
              <Typography variant="body1">
                Entreprises de livraison
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ background: 'linear-gradient(135deg, #f38c1c 0%, #e46c12 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                {deliveryCompanies.filter(c => c.status === 'active').length}
              </Typography>
              <Typography variant="body1">
                Entreprises actives
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" component="h2">
            Gestion des Entreprises de Livraison
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Ajouter une Entreprise
          </Button>
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Entreprise</TableCell>
                <TableCell>Contact</TableCell>
                <TableCell>Adresse</TableCell>
                <TableCell>Statut</TableCell>
                <TableCell>Mot de passe</TableCell>
                <TableCell>Date création</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveryCompanies.map((company) => (
                <TableRow key={company.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <LocalShipping sx={{ color: 'primary.main' }} />
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {company.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          ID: {company.id}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        <Email sx={{ fontSize: 16, mr: 0.5, verticalAlign: 'middle' }} />
                        {company.email}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {company.phone}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2">
                      {company.address}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Chip 
                      label={getStatusText(company.status)} 
                      color={getStatusColor(company.status)}
                      size="small"
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Lock sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" fontFamily="monospace">
                        {company.password}
                      </Typography>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    {company.created_at}
                  </TableCell>
                  
                  <TableCell align="right">
                    <IconButton
                      onClick={() => handleOpenDialog(company)}
                      color="primary"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(company)}
                      color="error"
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Dialog pour créer/modifier */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {selectedCompany ? 'Modifier l\'entreprise' : 'Créer une entreprise de livraison'}
        </DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nom de l'entreprise"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Téléphone"
                value={formData.phone}
                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Adresse"
                multiline
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Mot de passe"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                helperText="Le mot de passe pour la connexion de l'entreprise"
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Annuler
          </Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCompany ? 'Modifier' : 'Créer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog de suppression */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>
          Confirmer la suppression
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer l'entreprise "{selectedCompany?.name}" ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleDeleteConfirm} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default DeliveryManagement