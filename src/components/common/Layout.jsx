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
  Avatar,
  Container,
  Divider,
  Grid // Ajout de l'import manquant
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
  Chat as ChatIcon,
  Email,
  Phone
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
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'))
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
    <List sx={{ py: 0 }}>
      {navigationItems.map((item, index) => (
        <ListItem 
          key={item.path} 
          component={Link} 
          to={item.path}
          onClick={() => setDrawerOpen(false)}
          className={`${location.pathname === item.path ? 'active-nav-item' : ''} fade-in-left`}
          style={{ 
            animationDelay: `${index * 0.1}s`,
            borderBottom: '1px solid rgba(0,0,0,0.1)'
          }}
          sx={{
            '&:hover': {
              backgroundColor: 'rgba(0,0,0,0.04)'
            }
          }}
        >
          <ListItemIcon sx={{ minWidth: 40 }}>
            {item.icon}
          </ListItemIcon>
          <ListItemText 
            primary={item.label} 
            primaryTypographyProps={{ fontSize: '0.95rem' }}
          />
        </ListItem>
      ))}
      {isAuthenticated && (
        <>
          <Divider sx={{ my: 1 }} />
          <ListItem 
            button
            onClick={handleLogout}
            className="logout-button fade-in-left"
            style={{ animationDelay: `${navigationItems.length * 0.1}s` }}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.1)'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <ExitToApp color="error" />
            </ListItemIcon>
            <ListItemText 
              primary="Déconnexion" 
              primaryTypographyProps={{ color: 'error.main' }}
            />
          </ListItem>
        </>
      )}
    </List>
  )

  return (
    <div className="layout">
      <AppBar 
        position="fixed" 
        className={`app-bar ${scrolled ? 'scrolled' : ''}`}
        sx={{
          backgroundColor: scrolled ? 'rgba(46, 125, 50, 0.95)' : 'primary.main',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.3s ease',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1, minHeight: { xs: 70, md: 80 } }}>
            {/* Logo */}
            <Box 
              className="logo-section"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexShrink: 0
              }}
            >
              <img 
                src={logo1} 
                alt="TERRABIA" 
                 style={{ 
                      height: '160px', 
                      marginBottom: '21px',
                      borderRadius: '8px',
                      cursor: 'pointer' ,
                    }} 
                className="logo"
                onClick={() => navigate('/')}
                
              />
              {/* {!isMobile && (
                <Typography variant="h6" className="app-title">
                  TERRABIA
                </Typography>
              )} */}
            </Box>

            {/* Navigation pour desktop */}
            {!isMobile && (
              <Box 
                className="nav-section"
                sx={{ 
                  display: 'flex', 
                  flex: 1, 
                  justifyContent: 'center',
                  mx: 4
                }}
              >
                {navigationItems.map((item, index) => (
                  <Button
                    key={item.path}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    startIcon={!isSmallMobile && item.icon}
                    className={`${location.pathname === item.path ? 'active-nav-button' : ''} fade-in-down`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                    sx={{
                      mx: 1,
                      px: 2,
                      borderRadius: 2,
                      fontWeight: location.pathname === item.path ? 600 : 400,
                      backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.2)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.15)'
                      }
                    }}
                  >
                    {isSmallMobile ? React.cloneElement(item.icon, { fontSize: 'small' }) : item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Section authentification */}
            <Box 
              className="auth-section"
              sx={{ 
                display: 'flex', 
                alignItems: 'center',
                flexShrink: 0
              }}
            >
              {isAuthenticated ? (
                <Box className="user-info fade-in-right" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Panier pour les clients */}
                  {(user?.role === 'customer' || user?.role === 'buyer' || user?.user_type === 'customer' || user?.user_type === 'buyer') && (
                    <IconButton 
                      color="inherit" 
                      component={Link} 
                      to="/cart"
                      size="medium"
                      className="cart-badge"
                      sx={{ 
                        position: 'relative',
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                      }}
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
                    size="medium"
                    sx={{ 
                      ml: 1,
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    <Avatar 
                      className="user-avatar"
                      sx={{ 
                        width: 36, 
                        height: 36, 
                        bgcolor: 'secondary.main',
                        fontSize: '0.9rem',
                        fontWeight: 600
                      }}
                    >
                      {user?.first_name?.[0]?.toUpperCase() || user?.name?.[0]?.toUpperCase() || <Person />}
                    </Avatar>
                  </IconButton>
                  
                  {!isMobile && (
                    <Typography variant="body2" className="user-name">
                      {user?.first_name || user?.name || 'Utilisateur'}
                    </Typography>
                  )}
                  
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleProfileMenuClose}
                    PaperProps={{
                      elevation: 8,
                      sx: {
                        mt: 1.5,
                        minWidth: 200,
                        '& .MuiMenuItem-root': {
                          px: 2,
                          py: 1.5,
                        }
                      }
                    }}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                  >
                    <MenuItem onClick={handleDashboard}>
                      <ListItemIcon>
                        {getDashboardIcon()}
                      </ListItemIcon>
                      <ListItemText 
                        primary={getDashboardLabel()} 
                        primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                      />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout}>
                      <ListItemIcon>
                        <ExitToApp fontSize="small" color="error" />
                      </ListItemIcon>
                      <ListItemText 
                        primary="Déconnexion" 
                        primaryTypographyProps={{ color: 'error.main', variant: 'body2' }}
                      />
                    </MenuItem>
                  </Menu>
                </Box>
              ) : (
                <Box className="fade-in-right" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button 
                    color="inherit" 
                    component={Link} 
                    to="/login"
                    startIcon={!isSmallMobile && <Person />}
                    sx={{
                      borderRadius: 2,
                      '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                    }}
                  >
                    {isSmallMobile ? <Person /> : 'Connexion'}
                  </Button>
                  {!isSmallMobile && (
                    <Button 
                      variant="outlined" 
                      sx={{ 
                        color: 'white', 
                        borderColor: 'white',
                        borderRadius: 2,
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
                  )}
                </Box>
              )}

              {/* Menu mobile */}
              {isMobile && (
                <IconButton
                  edge="end"
                  color="inherit"
                  aria-label="menu"
                  onClick={() => setDrawerOpen(true)}
                  className="fade-in-right"
                  sx={{ ml: 1 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Drawer mobile */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            maxWidth: '80vw'
          }
        }}
      >
        <Box className="drawer-header">
          <Typography variant="h6" component="div">
            TERRABIA
          </Typography>
        </Box>
        <Box className="drawer-list">
          {renderNavigation()}
        </Box>
      </Drawer>

      {/* Espace pour la barre d'appbar fixe */}
      <Toolbar sx={{ 
        minHeight: { xs: 70, md: 80 } 
      }} />

      <main className={`main-content ${scrolled ? 'scrolled' : ''}`}>
        <Outlet />
      </main>

      {/* Footer amélioré */}
      <footer className="footer">
        <Container maxWidth="xl">
          <Box className="footer-content">
            <Grid container spacing={4}>
              {/* Logo et description */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'center', md: 'flex-start' } }} className="fade-in-up">
                  <img 
                    src={logo1} 
                    alt="TERRABIA" 
                    style={{ 
                      height: '160px', 
                      marginBottom: '16px',
                      borderRadius: '8px',
                    }} 
                  />
                 
                  <Typography variant="body2" className="footer-description">
                    Votre marché agricole en ligne - Produits frais du Cameroun et du monde
                  </Typography>
                </Box>
              </Grid>

              {/* Liens rapides */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }} className="fade-in-up" style={{ animationDelay: '0.1s' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Liens Rapides
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button color="inherit" component={Link} to="/about" sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                      À propos
                    </Button>
                    <Button color="inherit" component={Link} to="/contact" sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                      Contact
                    </Button>
                    <Button color="inherit" component={Link} to="/terms" sx={{ justifyContent: { xs: 'center', sm: 'flex-start' } }}>
                      Conditions d'utilisation
                    </Button>
                  </Box>
                </Box>
              </Grid>

              {/* Contact */}
              <Grid item xs={12} sm={6} md={4}>
                <Box sx={{ textAlign: { xs: 'center', sm: 'left' } }} className="fade-in-up" style={{ animationDelay: '0.2s' }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                    Contact
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, alignItems: { xs: 'center', sm: 'flex-start' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email fontSize="small" />
                      <Typography variant="body2">contact@terrabia.com</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone fontSize="small" />
                      <Typography variant="body2">+237 XXX XXX XXX</Typography>
                    </Box>
                  </Box>
                </Box>
              </Grid>
            </Grid>

            {/* Copyright */}
            <Box sx={{ textAlign: 'center', mt: 4, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Typography variant="body2" className="copyright">
                © 2024 TERRABIA. Tous droits réservés.
              </Typography>
            </Box>
          </Box>
        </Container>
      </footer>
    </div>
  )
}

export default Layout