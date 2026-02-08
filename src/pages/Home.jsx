import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Avatar,
  Rating,
  IconButton
} from '@mui/material'
import {
  LocalFlorist,
  ShoppingBasket,
  Speed,
  Security,
  ChevronLeft,
  ChevronRight
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import './Home.css'

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [direction, setDirection] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const features = [
    {
      icon: <LocalFlorist sx={{ fontSize: 48, color: '#2d7a3e' }} />,
      title: 'Produits Frais',
      description: 'Des produits agricoles frais directement des champs aux consommateurs'
    },
    {
      icon: <ShoppingBasket sx={{ fontSize: 48, color: '#2d7a3e' }} />,
      title: 'Achat Facile',
      description: 'Commandez vos produits préférés en quelques clics'
    },
    {
      icon: <Speed sx={{ fontSize: 48, color: '#2d7a3e' }} />,
      title: 'Livraison Rapide',
      description: 'Livraison express de vos produits frais'
    },
    {
      icon: <Security sx={{ fontSize: 48, color: '#2d7a3e' }} />,
      title: 'Paiement Sécurisé',
      description: 'Paiement via Orange Money, MTN Money et PayPal'
    }
  ]

  const testimonials = [
    {
      name: 'Anastasie F.',
      role: 'Agricultrice',
      text: 'Grâce à Terrabia, je peux vendre mes produits frais à un large public et obtenir un bon prix. La plateforme est intuitive',
      avatar: '👩🏿‍🌾',
      rating: 5
    },
    {
      name: 'Alain D.',
      role: 'Client',
      text: "J'adore commander sur Terrabia. Les produits sont toujours frais et la livraison est super rapide.",
      avatar: '👨🏾‍🌾',
      rating: 5
    },
    {
      name: 'Marie K.',
      role: 'Cliente',
      text: "Une plateforme exceptionnelle ! Je trouve tous les produits locaux dont j'ai besoin. Qualité au top !",
      avatar: '👩🏽',
      rating: 5
    },
    {
      name: 'Joseph M.',
      role: 'Agriculteur',
      text: "Terrabia m'a permis d'élargir ma clientèle et d'augmenter mes revenus. Je recommande vivement !",
      avatar: '👨🏿‍🌾',
      rating: 5
    }
  ]

  // Défilement automatique des témoignages
  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      setDirection(1)
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000) // Change tous les 5 secondes

    return () => clearInterval(interval)
  }, [isPaused, testimonials.length])

  const handlePreviousTestimonial = () => {
    setDirection(-1)
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  const handleNextTestimonial = () => {
    setDirection(1)
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const testimonialVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      scale: 0.8
    })
  }

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          minHeight: '90vh',
          background: 'linear-gradient(135deg, rgba(34, 87, 46, 0.95) 0%, rgba(45, 122, 62, 0.9) 100%)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          backgroundImage: 'url("https://images.unsplash.com/photo-1542838132-92c53300491e?w=1600")',
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundBlendMode: 'overlay',
          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to right, rgba(34, 87, 46, 0.98) 0%, rgba(34, 87, 46, 0.7) 60%, transparent 100%)'
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1, py: 8 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    lineHeight: 1.2
                  }}
                >
                  Votre marché agricole en ligne<br />
                  pour des produits frais du{' '}
                  <Box component="span" sx={{ color: '#ffa726' }}>
                    Cameroun
                  </Box>
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    color: 'rgba(255,255,255,0.95)',
                    mb: 5,
                    maxWidth: 600,
                    lineHeight: 1.6,
                    fontWeight: 400
                  }}
                >
                  Achetez et vendez des produits agricoles frais directement
                  de la ferme à votre table via notre plateforme innovante.
                </Typography>

                <Box sx={{ display: 'flex', gap: 2, mb: 6, flexWrap: 'wrap' }}>
                  <Button
                    component={Link}
                    to="/products"
                    variant="contained"
                    size="large"
                    sx={{
                      bgcolor: '#ffa726',
                      color: 'white',
                      px: 5,
                      py: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: '10px',
                      textTransform: 'none',
                      boxShadow: '0 4px 15px rgba(255, 167, 38, 0.4)',
                      '&:hover': {
                        bgcolor: '#fb8c00',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 6px 20px rgba(255, 167, 38, 0.5)'
                      },
                      transition: 'all 0.3s'
                    }}
                  >
                    Découvrir les produits
                  </Button>

                  <Button
                    component={Link}
                    to="/register"
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: 'white',
                      color: 'white',
                      px: 5,
                      py: 2,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: '10px',
                      borderWidth: 2,
                      textTransform: 'none',
                      '&:hover': {
                        borderWidth: 2,
                        bgcolor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)'
                      },
                      transition: 'all 0.3s'
                    }}
                  >
                    Créer un compte
                  </Button>
                </Box>

                {/* Badges de paiement */}
                <Box
                  sx={{
                    bgcolor: 'white',
                    borderRadius: '12px',
                    p: 2.5,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                    flexWrap: 'wrap'
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Box
                      sx={{
                        bgcolor: '#FFD700',
                        color: 'black',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      MTN
                    </Box>
                    <Box
                      sx={{
                        bgcolor: '#FF6600',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      Orange Money
                    </Box>
                    <Box
                      sx={{
                        bgcolor: '#003087',
                        color: 'white',
                        px: 1.5,
                        py: 0.5,
                        borderRadius: '6px',
                        fontWeight: 700,
                        fontSize: '0.85rem'
                      }}
                    >
                      PayPal
                    </Box>
                  </Box>
                  <Box sx={{ borderLeft: '2px solid #e0e0e0', pl: 2, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Typography sx={{ color: '#2d7a3e', fontWeight: 700, fontSize: '1.1rem' }}>
                      ★ TrustPilot
                    </Typography>
                    <Typography sx={{ color: '#000', fontWeight: 600, ml: 1 }}>
                      4.8 ★★★
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>

        {/* Vague décorative */}
        <Box
          sx={{
            position: 'absolute',
            bottom: -2,
            left: 0,
            right: 0,
            lineHeight: 0
          }}
        >
          <svg viewBox="0 0 1440 120" style={{ width: '100%', display: 'block' }}>
            <path
              fill="#f5f5f5"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </Box>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 10, bgcolor: '#f5f5f5' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              color: '#2d5f3c',
              mb: 8
            }}
          >
            Pourquoi choisir TERRABIA ?
          </Typography>

          <Grid container spacing={4}>
            {features.slice(0, 2).map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                      border: '1px solid #e8e8e8',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 30px rgba(45, 122, 62, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 5, textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: '50%',
                          bgcolor: '#e8f5e9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h5"
                        sx={{
                          fontWeight: 700,
                          color: '#2d5f3c',
                          mb: 2
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        sx={{
                          color: '#666',
                          lineHeight: 1.7
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          <Grid container spacing={4} sx={{ mt: 2 }}>
            {features.slice(2).map((feature, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index + 2) * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: '16px',
                      boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
                      border: '1px solid #e8e8e8',
                      transition: 'all 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 8px 30px rgba(45, 122, 62, 0.15)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Box
                        sx={{
                          width: 70,
                          height: 70,
                          borderRadius: '50%',
                          bgcolor: '#e8f5e9',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 'auto',
                          mb: 3
                        }}
                      >
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 700,
                          color: '#2d5f3c',
                          mb: 2
                        }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: '#666',
                          lineHeight: 1.7
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section - CARROUSEL ANIMÉ */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, rgba(232, 245, 233, 0.6) 0%, rgba(200, 230, 201, 0.6) 100%)',
          position: 'relative',
          overflow: 'hidden'
        }}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Cercles décoratifs animés */}
        <motion.div
          style={{
            position: 'absolute',
            top: '20%',
            left: '5%',
            width: '200px',
            height: '200px',
            background: 'linear-gradient(135deg, #c8e6c9, #a5d6a7)',
            borderRadius: '50%',
            opacity: 0.3,
            filter: 'blur(60px)'
          }}
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, -30, 0]
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ display: 'inline-block' }}
              >
                <Typography sx={{ fontSize: '4rem', mb: 2 }}>💬</Typography>
              </motion.div>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: '#2d5f3c',
                  mb: 2
                }}
              >
                Ce que disent nos clients
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: '#2d7a3e',
                  maxWidth: 600,
                  mx: 'auto'
                }}
              >
                Découvrez les avis de notre communauté
              </Typography>
            </Box>
          </motion.div>

          {/* Carrousel */}
          <Box
            sx={{
              position: 'relative',
              maxWidth: 900,
              mx: 'auto',
              minHeight: 420
            }}
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentTestimonial}
                custom={direction}
                variants={testimonialVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  scale: { duration: 0.3 }
                }}
                style={{ position: 'absolute', width: '100%' }}
              >
                <Card
                  sx={{
                    borderRadius: '20px',
                    boxShadow: '0 8px 30px rgba(45, 122, 62, 0.2)',
                    border: '2px solid #c8e6c9',
                    bgcolor: 'white',
                    overflow: 'visible',
                    position: 'relative'
                  }}
                >
                  {/* Badge vérifié */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: -15,
                      right: 30,
                      bgcolor: '#2d7a3e',
                      color: 'white',
                      px: 3,
                      py: 1,
                      borderRadius: '20px',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      boxShadow: '0 4px 15px rgba(45, 122, 62, 0.4)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }}
                  >
                    ✓ Témoignage Vérifié
                  </Box>

                  <CardContent sx={{ p: 5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                      <motion.div
                        animate={{
                          scale: [1, 1.05, 1]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Avatar
                          sx={{
                            width: 90,
                            height: 90,
                            bgcolor: '#e8f5e9',
                            fontSize: '2.5rem',
                            mr: 3,
                            border: '3px solid #2d7a3e',
                            boxShadow: '0 4px 20px rgba(45, 122, 62, 0.2)'
                          }}
                        >
                          {testimonials[currentTestimonial].avatar}
                        </Avatar>
                      </motion.div>
                      <Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 800,
                            color: '#2d5f3c',
                            mb: 0.5
                          }}
                        >
                          {testimonials[currentTestimonial].name}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            color: '#2d7a3e',
                            fontWeight: 600
                          }}
                        >
                          {testimonials[currentTestimonial].role}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Guillemets décoratifs */}
                    <Box sx={{ position: 'relative', pl: 4, pr: 2 }}>
                      <Typography
                        sx={{
                          position: 'absolute',
                          top: -20,
                          left: 0,
                          fontSize: '5rem',
                          color: '#c8e6c9',
                          lineHeight: 1,
                          fontFamily: 'Georgia, serif'
                        }}
                      >
                        "
                      </Typography>

                      <Typography
                        sx={{
                          color: '#555',
                          fontSize: '1.2rem',
                          lineHeight: 2,
                          fontStyle: 'italic',
                          mb: 3,
                          position: 'relative'
                        }}
                      >
                        {testimonials[currentTestimonial].text}
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Rating
                        value={testimonials[currentTestimonial].rating}
                        readOnly
                        sx={{ color: '#ffa726', fontSize: '2rem' }}
                      />
                      <Typography
                        sx={{
                          color: '#2d5f3c',
                          fontWeight: 700,
                          fontSize: '1.1rem'
                        }}
                      >
                        {testimonials[currentTestimonial].rating}/5
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>

            {/* Flèches de navigation */}
            <IconButton
              onClick={handlePreviousTestimonial}
              sx={{
                position: 'absolute',
                left: { xs: -20, md: -70 },
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'white',
                border: '3px solid #2d7a3e',
                color: '#2d7a3e',
                width: { xs: 50, md: 60 },
                height: { xs: 50, md: 60 },
                boxShadow: '0 4px 20px rgba(45, 122, 62, 0.3)',
                '&:hover': {
                  bgcolor: '#2d7a3e',
                  color: 'white',
                  transform: 'translateY(-50%) scale(1.1)'
                },
                transition: 'all 0.3s'
              }}
            >
              <ChevronLeft sx={{ fontSize: 35 }} />
            </IconButton>

            <IconButton
              onClick={handleNextTestimonial}
              sx={{
                position: 'absolute',
                right: { xs: -20, md: -70 },
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'white',
                border: '3px solid #2d7a3e',
                color: '#2d7a3e',
                width: { xs: 50, md: 60 },
                height: { xs: 50, md: 60 },
                boxShadow: '0 4px 20px rgba(45, 122, 62, 0.3)',
                '&:hover': {
                  bgcolor: '#2d7a3e',
                  color: 'white',
                  transform: 'translateY(-50%) scale(1.1)'
                },
                transition: 'all 0.3s'
              }}
            >
              <ChevronRight sx={{ fontSize: 35 }} />
            </IconButton>
          </Box>

          {/* Indicateurs de position */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1.5,
              mt: 6
            }}
          >
            {testimonials.map((_, index) => (
              <motion.div
                key={index}
                onClick={() => {
                  setDirection(index > currentTestimonial ? 1 : -1)
                  setCurrentTestimonial(index)
                }}
                style={{ cursor: 'pointer' }}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <Box
                  sx={{
                    width: currentTestimonial === index ? 40 : 12,
                    height: 12,
                    borderRadius: 6,
                    bgcolor: currentTestimonial === index ? '#2d7a3e' : '#c8e6c9',
                    transition: 'all 0.3s',
                    boxShadow: currentTestimonial === index ? '0 2px 8px rgba(45, 122, 62, 0.4)' : 'none'
                  }}
                />
              </motion.div>
            ))}
          </Box>

          {/* Info défilement */}
          <Box
            sx={{
              textAlign: 'center',
              mt: 3,
              color: '#2d7a3e',
              fontSize: '0.9rem',
              fontWeight: 600
            }}
          >
            {isPaused ? '⏸️ Pause (survol)' : '▶️ Défilement automatique'}
          </Box>
        </Container>
      </Box>

      {/* CTA Section */}
      <Box
        sx={{
          py: 10,
          background: 'linear-gradient(135deg, #2d7a3e 0%, #1e5a2e 100%)',
          color: 'white'
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 700,
                mb: 3
              }}
            >
              Prêt à rejoindre notre communauté ?
            </Typography>
            <Typography
              variant="h6"
              sx={{
                mb: 5,
                opacity: 0.95,
                fontWeight: 400
              }}
            >
              Que vous soyez agriculteur cherchant à vendre vos produits ou
              consommateur à la recherche de produits frais, TERRABIA est fait pour vous.
            </Typography>
            <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                component={Link}
                to="/register?type=farmer"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: '#2d7a3e',
                  px: 5,
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                  textTransform: 'none',
                  '&:hover': {
                    bgcolor: '#f5f5f5',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s'
                }}
              >
                Devenir Agriculteur
              </Button>
              <Button
                component={Link}
                to="/register?type=customer"
                variant="outlined"
                size="large"
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  px: 5,
                  py: 2,
                  fontSize: '1rem',
                  fontWeight: 600,
                  borderRadius: '10px',
                  borderWidth: 2,
                  textTransform: 'none',
                  '&:hover': {
                    borderWidth: 2,
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s'
                }}
              >
                Devenir Client
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  )
}

export default Home