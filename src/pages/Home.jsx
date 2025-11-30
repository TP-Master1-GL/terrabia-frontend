import React from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  useTheme,
  useMediaQuery
} from '@mui/material'
import {
  LocalFlorist,
  ShoppingBasket,
  Speed,
  Security
} from '@mui/icons-material'
import { motion } from 'framer-motion'
import './Home.css'

const Home = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const features = [
    {
      icon: <LocalFlorist sx={{ fontSize: 48 }} />,
      title: 'Produits Frais',
      description: 'Des produits agricoles frais directement des champs aux consommateurs'
    },
    {
      icon: <ShoppingBasket sx={{ fontSize: 48 }} />,
      title: 'Achat Facile',
      description: 'Commandez vos produits préférés en quelques clics'
    },
    {
      icon: <Speed sx={{ fontSize: 48 }} />,
      title: 'Livraison Rapide',
      description: 'Livraison express de vos produits frais'
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: 'Paiement Sécurisé',
      description: 'Paiement via Orange Money, MTN Money et PayPal'
    }
  ]

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <Container maxWidth="lg">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="hero-content"
          >
            <Typography 
              variant={isMobile ? "h3" : "h2"} 
              component="h1" 
              className="hero-title"
              gutterBottom
            >
              Bienvenue sur{' '}
              <span className="brand-highlight">TERRABIA</span>
            </Typography>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              className="hero-subtitle"
              gutterBottom
            >
              Votre marché agricole en ligne - Produits frais du Cameroun et du monde
            </Typography>
            <Typography 
              variant="body1" 
              className="hero-description"
              paragraph
            >
              Connectez les agriculteurs aux consommateurs grâce à notre plateforme 
              innovante. Achetez des produits frais directement de la ferme à votre table.
            </Typography>
            <Box className="hero-actions">
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/products"
                className="cta-button"
              >
                Découvrir les produits
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/register"
                className="secondary-button"
              >
                Créer un compte
              </Button>
            </Box>
          </motion.div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" className="section-title" gutterBottom>
            Pourquoi choisir TERRABIA ?
          </Typography>
          <Grid container spacing={4} className="features-grid">
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="feature-card">
                    <CardContent className="feature-content">
                      <Box className="feature-icon">
                        {feature.icon}
                      </Box>
                      <Typography variant="h6" component="h3" className="feature-title">
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" className="feature-description">
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <Container maxWidth="md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="cta-content"
          >
            <Typography variant="h4" component="h2" className="cta-title" gutterBottom>
              Prêt à rejoindre notre communauté ?
            </Typography>
            <Typography variant="body1" className="cta-description" paragraph>
              Que vous soyez agriculteur cherchant à vendre vos produits ou 
              consommateur à la recherche de produits frais, TERRABIA est fait pour vous.
            </Typography>
            <Box className="cta-actions">
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/register?type=farmer"
                className="cta-button"
              >
                Devenir Agriculteur
              </Button>
              <Button
                variant="outlined"
                size="large"
                component={Link}
                to="/register?type=customer"
                className="secondary-button"
              >
                Devenir Client
              </Button>
            </Box>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}

export default Home