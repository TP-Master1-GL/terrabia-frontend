import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material'
import {
  Search,
  MoreVert,
  Edit,
  Block,
  CheckCircle,
  Delete
} from '@mui/icons-material'

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [blockDialogOpen, setBlockDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Données mockées - à remplacer par l'API
  const users = [
    {
      id: 1,
      name: 'Jean Dupont',
      email: 'jean@example.com',
      role: 'farmer',
      status: 'active',
      registrationDate: '2024-01-15',
      productsCount: 12
    },
    {
      id: 2,
      name: 'Marie Lambert',
      email: 'marie@example.com',
      role: 'customer',
      status: 'active',
      registrationDate: '2024-01-20',
      ordersCount: 5
    }
  ]

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget)
    setSelectedUser(user)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedUser(null)
  }

  const handleBlockUser = () => {
    // Implémenter la logique de blocage
    console.log('Bloquer utilisateur:', selectedUser)
    setBlockDialogOpen(false)
    handleMenuClose()
  }

  const handleDeleteUser = () => {
    // Implémenter la logique de suppression
    console.log('Supprimer utilisateur:', selectedUser)
    setDeleteDialogOpen(false)
    handleMenuClose()
  }

  const getStatusColor = (status) => {
    return status === 'active' ? 'success' : 'error'
  }

  const getRoleColor = (role) => {
    const colors = {
      farmer: 'primary',
      customer: 'secondary',
      admin: 'warning',
      delivery: 'info'
    }
    return colors[role] || 'default'
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" component="h2">
          Gestion des Utilisateurs
        </Typography>
        
        <TextField
          placeholder="Rechercher un utilisateur..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />
      </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Utilisateur</TableCell>
              <TableCell>Rôle</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell>Date d'inscription</TableCell>
              <TableCell>Activité</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Box>
                    <Typography variant="subtitle2" fontWeight="bold">
                      {user.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {user.email}
                    </Typography>
                  </Box>
                </TableCell>
                
                <TableCell>
                  <Chip 
                    label={user.role === 'farmer' ? 'Agriculteur' : 
                           user.role === 'customer' ? 'Client' : 
                           user.role === 'admin' ? 'Administrateur' : 'Livreur'} 
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                
                <TableCell>
                  <Chip 
                    label={user.status === 'active' ? 'Actif' : 'Bloqué'} 
                    color={getStatusColor(user.status)}
                    size="small"
                  />
                </TableCell>
                
                <TableCell>
                  {new Date(user.registrationDate).toLocaleDateString('fr-FR')}
                </TableCell>
                
                <TableCell>
                  {user.role === 'farmer' && (
                    <Typography variant="body2">
                      {user.productsCount} produits
                    </Typography>
                  )}
                  {user.role === 'customer' && (
                    <Typography variant="body2">
                      {user.ordersCount} commandes
                    </Typography>
                  )}
                </TableCell>
                
                <TableCell align="right">
                  <IconButton
                    onClick={(e) => handleMenuOpen(e, user)}
                    size="small"
                  >
                    <MoreVert />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <Edit sx={{ mr: 1 }} />
          Modifier
        </MenuItem>
        <MenuItem onClick={() => setBlockDialogOpen(true)}>
          {selectedUser?.status === 'active' ? <Block sx={{ mr: 1 }} /> : <CheckCircle sx={{ mr: 1 }} />}
          {selectedUser?.status === 'active' ? 'Bloquer' : 'Débloquer'}
        </MenuItem>
        <MenuItem onClick={() => setDeleteDialogOpen(true)} sx={{ color: 'error.main' }}>
          <Delete sx={{ mr: 1 }} />
          Supprimer
        </MenuItem>
      </Menu>

      <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)}>
        <DialogTitle>
          {selectedUser?.status === 'active' ? 'Bloquer' : 'Débloquer'} l'utilisateur
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir {selectedUser?.status === 'active' ? 'bloquer' : 'débloquer'} {selectedUser?.name} ?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setBlockDialogOpen(false)}>
            Annuler
          </Button>
          <Button 
            onClick={handleBlockUser} 
            color={selectedUser?.status === 'active' ? 'warning' : 'success'}
          >
            {selectedUser?.status === 'active' ? 'Bloquer' : 'Débloquer'}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>
          Supprimer l'utilisateur
        </DialogTitle>
        <DialogContent>
          <Typography>
            Êtes-vous sûr de vouloir supprimer définitivement {selectedUser?.name} ? 
            Cette action est irréversible.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>
            Annuler
          </Button>
          <Button onClick={handleDeleteUser} color="error">
            Supprimer
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

export default UserManagement