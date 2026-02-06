import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
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
  const [hoveredCard, setHoveredCard] = useState(null)

  const features = [
    {
      icon: <LocalFlorist sx={{ fontSize: 48 }} />,
      title: 'Produits Frais',
      description: 'Des produits agricoles frais directement des champs aux consommateurs',
      color: '#10b981',
      emoji: '🌱'
    },
    {
      icon: <ShoppingBasket sx={{ fontSize: 48 }} />,
      title: 'Achat Facile',
      description: 'Commandez vos produits préférés en quelques clics',
      color: '#84cc16',
      emoji: '🛒'
    },
    {
      icon: <Speed sx={{ fontSize: 48 }} />,
      title: 'Livraison Rapide',
      description: 'Livraison express de vos produits frais',
      color: '#14b8a6',
      emoji: '⚡'
    },
    {
      icon: <Security sx={{ fontSize: 48 }} />,
      title: 'Paiement Sécurisé',
      description: 'Paiement via Orange Money, MTN Money et PayPal',
      color: '#22c55e',
      emoji: '🔒'
    }
  ]

  const stats = [
    { value: '500+', label: 'Agriculteurs', emoji: '🌾' },
    { value: '2000+', label: 'Clients Satisfaits', emoji: '😊' },
    { value: '50+', label: 'Produits Disponibles', emoji: '🥬' }
  ]

  return (
    <Box className="home-page" sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        component="section"
        sx={{
          background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 50%, #86efac 100%)',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          py: 8
        }}
      >
        {/* Formes décoratives animées */}
        <motion.div
          style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, #34d399, #10b981)',
            borderRadius: '50%',
            opacity: 0.2,
            filter: 'blur(60px)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        
        <motion.div
          style={{
            position: 'absolute',
            bottom: '15%',
            right: '10%',
            width: '250px',
            height: '250px',
            background: 'linear-gradient(135deg, #6ee7b7, #34d399)',
            borderRadius: '50%',
            opacity: 0.2,
            filter: 'blur(60px)'
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, 40, 0]
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />

        {/* Étoiles scintillantes */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: '20px'
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.3
            }}
          >
            ✨
          </motion.div>
        ))}

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge animé */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Box
                sx={{
                  display: 'inline-block',
                  bgcolor: 'white',
                  px: 3,
                  py: 1,
                  borderRadius: '50px',
                  boxShadow: '0 4px 20px rgba(16, 185, 129, 0.3)',
                  border: '2px solid #10b981',
                  mb: 3
                }}
              >
                <Typography
                  sx={{
                    color: '#10b981',
                    fontWeight: 700,
                    fontSize: '0.95rem'
                  }}
                >
                  🌱 100% Bio & Local
                </Typography>
              </Box>
            </motion.div>

            <Typography
              variant={isMobile ? 'h3' : 'h2'}
              component="h1"
              sx={{
                fontWeight: 900,
                mb: 2,
                textAlign: 'center'
              }}
            >
              <Box component="span" sx={{ color: '#16a34a' }}>
                Bienvenue sur
              </Box>
              <br />
              <motion.span
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{
                  background: 'linear-gradient(90deg, #10b981, #34d399, #6ee7b7, #10b981)',
                  backgroundSize: '200% 100%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                TERRABIA
              </motion.span>
            </Typography>

            <Typography
              variant={isMobile ? 'h6' : 'h5'}
              sx={{
                mb: 2,
                textAlign: 'center',
                color: '#15803d',
                fontWeight: 600
              }}
            >
              🌍 Votre marché agricole en ligne - Produits frais du Cameroun et du monde
            </Typography>

            <Typography
              variant="body1"
              sx={{
                mb: 5,
                textAlign: 'center',
                maxWidth: 700,
                mx: 'auto',
                fontSize: '1.1rem',
                color: '#166534',
                lineHeight: 1.8
              }}
            >
              Connectez les agriculteurs aux consommateurs grâce à notre plateforme
              innovante. Achetez des produits frais directement de la ferme à votre table! 🚜➡️🏡
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mb: 8 }}>
              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="contained"
                  size="large"
                  component={Link}
                  to="/products"
                  sx={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    fontWeight: 700,
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: '15px',
                    boxShadow: '0 8px 30px rgba(16, 185, 129, 0.4)',
                    textTransform: 'none',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                      boxShadow: '0 12px 40px rgba(16, 185, 129, 0.5)'
                    }
                  }}
                >
                  🛒 Découvrir les produits
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05, y: -5 }} whileTap={{ scale: 0.95 }}>
                <Button
                  variant="outlined"
                  size="large"
                  component={Link}
                  to="/register"
                  sx={{
                    borderColor: '#10b981',
                    borderWidth: 3,
                    color: '#10b981',
                    fontWeight: 700,
                    px: 5,
                    py: 2,
                    fontSize: '1.1rem',
                    borderRadius: '15px',
                    textTransform: 'none',
                    '&:hover': {
                      borderWidth: 3,
                      bgcolor: 'rgba(16, 185, 129, 0.1)',
                      borderColor: '#059669'
                    }
                  }}
                >
                  ✨ Créer un compte
                </Button>
              </motion.div>
            </Box>

            {/* Stats animées */}
            <Grid container spacing={3} sx={{ mt: 4 }}>
              {stats.map((stat, index) => (
                <Grid item xs={12} sm={4} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -8 }}
                  >
                    <Card
                      sx={{
                        bgcolor: 'white',
                        borderRadius: '20px',
                        p: 3,
                        textAlign: 'center',
                        boxShadow: '0 8px 30px rgba(16, 185, 129, 0.2)',
                        border: '3px solid #86efac',
                        cursor: 'pointer',
                        transition: 'all 0.3s',
                        '&:hover': {
                          borderColor: '#10b981',
                          boxShadow: '0 12px 40px rgba(16, 185, 129, 0.3)'
                        }
                      }}
                    >
                      <Typography sx={{ fontSize: '3rem', mb: 1 }}>
                        {stat.emoji}
                      </Typography>
                      <motion.div
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
                      >
                        <Typography
                          variant="h3"
                          sx={{
                            fontWeight: 900,
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            mb: 1
                          }}
                        >
                          {stat.value}
                        </Typography>
                      </motion.div>
                      <Typography sx={{ color: '#15803d', fontWeight: 600 }}>
                        {stat.label}
                      </Typography>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Container>

        {/* Vague décorative */}
        <Box sx={{ position: 'absolute', bottom: 0, left: 0, right: 0, lineHeight: 0 }}>
          <svg viewBox="0 0 1440 120" style={{ width: '100%' }}>
            <motion.path
              fill="#f0fdf4"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              animate={{
                d: [
                  "M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z",
                  "M0,32L48,37.3C96,43,192,53,288,58.7C384,64,480,64,576,58.7C672,53,768,43,864,48C960,53,1056,75,1152,80C1248,85,1344,75,1392,69.3L1440,64L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z",
                  "M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
                ]
              }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </svg>
        </Box>
      </Box>

      {/* Features Section */}
      <Box
        component="section"
        sx={{
          py: 12,
          bgcolor: '#f0fdf4',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Cercles décoratifs */}
        <Box
          sx={{
            position: 'absolute',
            top: '10%',
            right: '5%',
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
            borderRadius: '50%',
            opacity: 0.3,
            filter: 'blur(80px)'
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ display: 'inline-block' }}
              >
                <Typography sx={{ fontSize: '4rem', mb: 2 }}>🌟</Typography>
              </motion.div>
              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 900,
                  color: '#15803d',
                  mb: 2
                }}
              >
                Pourquoi choisir TERRABIA ?
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#16a34a',
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                Découvrez tous les avantages de notre plateforme innovante
              </Typography>
            </Box>
          </motion.div>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  onHoverStart={() => setHoveredCard(index)}
                  onHoverEnd={() => setHoveredCard(null)}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '25px',
                      boxShadow: '0 8px 30px rgba(16, 185, 129, 0.15)',
                      border: '3px solid #a7f3d0',
                      overflow: 'hidden',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                      '&:hover': {
                        transform: 'translateY(-15px) scale(1.02)',
                        boxShadow: `0 20px 50px ${feature.color}40`,
                        borderColor: feature.color
                      }
                    }}
                  >
                    {/* Effet de brillance */}
                    {hoveredCard === index && (
                      <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{ duration: 0.8 }}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                          zIndex: 1,
                          pointerEvents: 'none'
                        }}
                      />
                    )}

                    <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 2 }}>
                      <motion.div
                        animate={
                          hoveredCard === index
                            ? { rotate: 360, scale: [1, 1.2, 1] }
                            : {}
                        }
                        transition={{ duration: 0.6 }}
                      >
                        <Box
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: '50%',
                            background: `linear-gradient(135deg, ${feature.color}30, ${feature.color}60)`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 3,
                            color: feature.color,
                            transition: 'all 0.3s',
                            '&:hover': {
                              background: `linear-gradient(135deg, ${feature.color}, ${feature.color})`
                            }
                          }}
                        >
                          {feature.icon}
                        </Box>
                      </motion.div>

                      <Typography
                        sx={{
                          fontSize: '2rem',
                          mb: 2
                        }}
                      >
                        {feature.emoji}
                      </Typography>

                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          fontWeight: 700,
                          color: '#15803d',
                          mb: 2
                        }}
                      >
                        {feature.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        sx={{
                          color: '#166534',
                          lineHeight: 1.7
                        }}
                      >
                        {feature.description}
                      </Typography>

                      {/* Confettis */}
                      {hoveredCard === index && (
                        <>
                          {[...Array(6)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{
                                x: '50%',
                                y: '50%',
                                scale: 0
                              }}
                              animate={{
                                x: `${Math.cos((i * 60 * Math.PI) / 180) * 100}%`,
                                y: `${Math.sin((i * 60 * Math.PI) / 180) * 100}%`,
                                scale: [0, 1, 0]
                              }}
                              transition={{ duration: 0.6 }}
                              style={{
                                position: 'absolute',
                                width: '8px',
                                height: '8px',
                                background: feature.color,
                                borderRadius: '50%'
                              }}
                            />
                          ))}
                        </>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        component="section"
        sx={{
          py: 12,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Bulles flottantes */}
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.3
            }}
          />
        ))}

        <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ display: 'inline-block' }}
              >
                <Typography sx={{ fontSize: '5rem', mb: 3 }}>🎉</Typography>
              </motion.div>

              <Typography
                variant="h4"
                component="h2"
                sx={{
                  fontWeight: 900,
                  color: 'white',
                  mb: 3
                }}
              >
                Prêt à rejoindre notre communauté ?
              </Typography>

              <Typography
                variant="body1"
                sx={{
                  color: 'rgba(255,255,255,0.95)',
                  mb: 5,
                  fontSize: '1.2rem',
                  maxWidth: 600,
                  mx: 'auto',
                  lineHeight: 1.8
                }}
              >
                Que vous soyez agriculteur cherchant à vendre vos produits ou
                consommateur à la recherche de produits frais, TERRABIA est fait pour vous! 🌱
              </Typography>

              <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
                <motion.div whileHover={{ scale: 1.1, y: -8 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to="/register?type=farmer"
                    sx={{
                      bgcolor: 'white',
                      color: '#10b981',
                      fontWeight: 700,
                      px: 5,
                      py: 2.5,
                      fontSize: '1.1rem',
                      borderRadius: '15px',
                      textTransform: 'none',
                      boxShadow: '0 8px 30px rgba(255,255,255,0.3)',
                      '&:hover': {
                        bgcolor: '#f0fdf4'
                      }
                    }}
                  >
                    🚜 Devenir Agriculteur
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.1, y: -8 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    component={Link}
                    to="/register?type=customer"
                    sx={{
                      borderColor: 'white',
                      borderWidth: 3,
                      color: 'white',
                      fontWeight: 700,
                      px: 5,
                      py: 2.5,
                      fontSize: '1.1rem',
                      borderRadius: '15px',
                      textTransform: 'none',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        borderWidth: 3,
                        bgcolor: 'rgba(255,255,255,0.15)'
                      }
                    }}
                  >
                    🛍️ Devenir Client
                  </Button>
                </motion.div>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  )
}

export default Home