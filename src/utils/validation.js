export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validatePhone = (phone) => {
  const re = /^(\+237|237)?[6-9][0-9]{8}$/
  return re.test(phone.replace(/\s/g, ''))
}

export const validatePassword = (password) => {
  return password.length >= 6
}

export const validateProduct = (product) => {
  const errors = {}

  if (!product.name || product.name.trim() === '') {
    errors.name = 'Le nom du produit est requis'
  }

  if (!product.price || product.price <= 0) {
    errors.price = 'Le prix doit être supérieur à 0'
  }

  if (!product.quantity || product.quantity <= 0) {
    errors.quantity = 'La quantité doit être supérieure à 0'
  }

  if (!product.category) {
    errors.category = 'La catégorie est requise'
  }

  if (!product.description || product.description.trim() === '') {
    errors.description = 'La description est requise'
  }

  return errors
}