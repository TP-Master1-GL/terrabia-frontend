// components/common/Layout.jsx
import React, { useState, useEffect } from 'react'
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  Box,
  useMediaQuery,
  useTheme,
  Badge,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material'
import {
  Menu as MenuIcon,
  ShoppingCart,
  Person,
  ExitToApp,
  Dashboard,
  Home,
  Store,
  ShoppingBag,
  LocalShipping,
  AdminPanelSettings,
  Chat as ChatIcon
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext'
import './Layout.css'
import logo1 from '../../assets/logo.png';

const Layout = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [cartItemsCount, setCartItemsCount] = useState(0)

  // Gestion du défilement
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50
      setScrolled(isScrolled)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    setDrawerOpen(false)
    setAnchorEl(null)
    navigate('/')
  }

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleProfileMenuClose = () => {
    setAnchorEl(null)
  }

  const handleDashboard = () => {
    const userRole = user?.role || user?.user_type
    if (userRole === 'admin') {
      navigate('/admin')
    } else if (userRole === 'farmer') {
      navigate('/farmer')
    } else if (userRole === 'delivery') {
      navigate('/delivery')
    } else {
      navigate('/customer')
    }
    setDrawerOpen(false)
    handleProfileMenuClose()
  }

  const getDashboardIcon = () => {
    const userRole = user?.role || user?.user_type
    switch (userRole) {
      case 'admin': return <AdminPanelSettings />
      case 'farmer': return <Store />
      case 'delivery': return <LocalShipping />
      default: return <Dashboard />
    }
  }

  const getDashboardLabel = () => {
    const userRole = user?.role || user?.user_type
    switch (userRole) {
      case 'admin': return 'Administration'
      case 'farmer': return 'Tableau Agriculteur'
      case 'delivery': return 'Livraisons'
      default: return 'Mon Compte'
    }
  }

  const navigationItems = [
    { path: '/', label: 'Accueil', icon: <Home /> },
    { path: '/products', label: 'Produits', icon: <Store /> },
  ]

  if (isAuthenticated) {
    const userRole = user?.role || user?.user_type
    
    // Ajouter les éléments de navigation selon le rôle
    if (userRole === 'farmer') {
      navigationItems.push(
        { path: '/farmer', label: 'Tableau de bord', icon: <Dashboard /> },
        { path: '/orders', label: 'Commandes', icon: <ShoppingBag /> },
        { path: '/chat', label: 'Messages', icon: <ChatIcon /> }
      )
    } else if (userRole === 'customer' || userRole === 'buyer') {
      navigationItems.push(
        { path: '/customer', label: 'Mon compte', icon: <Dashboard /> },
        { path: '/cart', label: 'Panier', icon: <ShoppingCart /> },
        { path: '/orders', label: 'Mes commandes', icon: <ShoppingBag /> },
        { path: '/chat', label: 'Messages', icon: <ChatIcon /> }
      )
    } else if (userRole === 'admin') {
      navigationItems.push(
        { path: '/admin', label: 'Administration', icon: <AdminPanelSettings /> }
      )
    } else if (userRole === 'delivery') {
      navigationItems.push(
        { path: '/delivery', label: 'Livraisons', icon: <LocalShipping /> }
      )
    }
  }

  const renderNavigation = () => (
    <List>
      {navigationItems.map((item, index) => (
        <ListItem 
          key={item.path} 
          component={Link} 
          to={item.path}
          onClick={() => setDrawerOpen(false)}
          className={`${location.pathname === item.path ? 'active-nav-item' : ''} fade-in-left`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <ListItemIcon>
            {item.icon}
          </ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
      {isAuthenticated && (
        <ListItem 
          button
          onClick={handleLogout}
          className="logout-button fade-in-left"
          style={{ animationDelay: `${navigationItems.length * 0.1}s` }}
        >
          <ListItemIcon>
            <ExitToApp />
          </ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItem>
      )}
    </List>
  )

  return (
    <div className="layout">
      <AppBar position="relative" className={`app-bar ${scrolled ? 'scrolled' : ''}`}>
        <Toolbar>
          <Box className="logo-section">
           <img 
                           src={logo1} 
                           alt="TERRABIA" 
                           style={{ 
                             height: '170px', 
                             marginBottom: '16px',
                             borderRadius: '12px',
                             
                           }} 
            />
          </Box>

          {isMobile ? (
            <>
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                className="fade-in-right"
              >
                <MenuIcon />
              </IconButton>
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
              >
                <Box sx={{ width: 250 }} role="presentation">
                  {renderNavigation()}
                </Box>
              </Drawer>
            </>
          ) : (
            <Box className="nav-section">
              {navigationItems.map((item, index) => (
                <Button
                  key={item.path}
                  color="inherit"
                  component={Link}
                  to={item.path}
                  startIcon={item.icon}
                  className={`${location.pathname === item.path ? 'active-nav-button' : ''} fade-in-down`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          <Box className="auth-section">
            {isAuthenticated ? (
              <Box className="user-info fade-in-right">
                {/* Panier pour les clients */}
                {(user?.role === 'customer' || user?.role === 'buyer' || user?.user_type === 'customer' || user?.user_type === 'buyer') && (
                  <IconButton 
                    color="inherit" 
                    component={Link} 
                    to="/cart"
                    size="large"
                  >
                    <Badge badgeContent={cartItemsCount} color="error">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                )}
                
                {/* Menu profil */}
                <IconButton
                  onClick={handleProfileMenuOpen}
                  color="inherit"
                  size="large"
                >
                  <Avatar 
                    sx={{ 
                      width: 32, 
                      height: 32, 
                      bgcolor: 'primary.light',
                      fontSize: '0.875rem'
                    }}
                  >
                    {user?.first_name?.[0] || user?.name?.[0] || <Person />}
                  </Avatar>
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  PaperProps={{
                    elevation: 3,
                    sx: {
                      mt: 1.5,
                      '& .MuiMenuItem-root': {
                        px: 2,
                        py: 1,
                      }
                    }
                  }}
                >
                  <MenuItem onClick={handleDashboard}>
                    <ListItemIcon>
                      {getDashboardIcon()}
                    </ListItemIcon>
                    <ListItemText primary={getDashboardLabel()} />
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <ExitToApp fontSize="small" />
                    </ListItemIcon>
                    <ListItemText primary="Déconnexion" />
                  </MenuItem>
                </Menu>
              </Box>
            ) : (
              <Box className="fade-in-right">
                <Button 
                  color="inherit" 
                  component={Link} 
                  to="/login"
                  startIcon={<Person />}
                >
                  Connexion
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    color: 'white', 
                    borderColor: 'white',
                    ml: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white'
                    }
                  }}
                  component={Link} 
                  to="/register"
                >
                  Inscription
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Espace pour la barre d'appbar fixe */}
      <Toolbar />

      <main className={`main-content ${scrolled ? 'scrolled' : ''}`}>
        <Outlet />
      </main>

      <footer className="footer">
        <Box className="footer-content">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }} className="fade-in-up">
            <img 
                            src={logo1} 
                            alt="TERRABIA" 
                            style={{ 
                                 height: '200px', 
                                  marginRight: '12px',
                                  borderRadius: '8px',
                                  filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))'
                              
                            }} 
                          />
            
          </Box>
          <Typography variant="body2" className="footer-description fade-in-up" style={{ animationDelay: '0.1s' }}>
            Votre marché agricole en ligne - Produits frais du Cameroun et du monde
          </Typography>
          <Box className="footer-links fade-in-up" style={{ animationDelay: '0.2s' }}>
            <Button color="inherit" component={Link} to="/about">À propos</Button>
            <Button color="inherit" component={Link} to="/contact">Contact</Button>
            <Button color="inherit" component={Link} to="/terms">Conditions d'utilisation</Button>
          </Box>
          <Typography variant="body2" className="copyright fade-in-up" style={{ animationDelay: '0.3s' }}>
            © 2024 TERRABIA. Tous droits réservés.
          </Typography>
        </Box>
      </footer>
    </div>
  )
}

export default Layout