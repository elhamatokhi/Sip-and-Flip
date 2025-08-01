import e, { Router } from 'express'
import fs, { read } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import session from 'express-session'
import {
  getRandomDrink,
  loadDrinks,
  loadOrders,
  getWikipediaData
} from '../cotrollers/drinksControllers.js'

import { getRandomUser } from '../cotrollers/userControllers.js'
import { getBooks, getReservedBooks } from '../cotrollers/booksController.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()

// Load taglines from the JSON file
const taglines = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/taglines.json'), 'utf8')
)

// HOME
router.get('/', (req, res) => {
  const user = getRandomUser()
  const drink = getRandomDrink()

  // Pick a random tagline
  const randomTagline = taglines[Math.floor(Math.random() * taglines.length)]

  res.render('index', {
    drink,
    user,
    randomTagline,
    greeting: `Hi, ${user.username}!`
  })
})
// End of HOME

/*------------------DRINKS-------------------- */

// Get All Drinks with filtering
router.get('/drinksMenu', (req, res) => {
  // Get all the drinks
  let drinks = loadDrinks()

  //  filter the drinks
  const selectedCategory = req.query.category || ''
  if (selectedCategory) {
    drinks = drinks.filter(p => p.category === selectedCategory)
  }
  const query = req.query.query?.toLowerCase() || ''
  // Filter books by title or author

  const filteredDrinks = query
    ? drinks.filter(
        drink =>
          drink.name.toLowerCase().includes(query) ||
          drink.description.toLowerCase().includes(query)
      )
    : drinks

  res.render('drinkMenu', {
    drinks: filteredDrinks,
    selectedCategory,
    query: req.query.query || ''
  })
})

// GET Drink Details

router.get('/orders/:name', async (req, res) => {
  const orders = loadOrders()
  const drinkName = req.params.name

  const drink = orders.find(o => o.name === drinkName)
  if (!drink) return res.status(404).send('Drink not found.')

  const formattedName =
    drinkName.charAt(0).toUpperCase() + drinkName.slice(1).toLowerCase()
  const wiki = await getWikipediaData(formattedName)

  res.render('drinkDetails.ejs', {
    drink,
    wiki
  })
})

// Get a random drink
router.get('/random', getRandomDrink)

/* -------------------------- BOOKS ------------------------- */

// GET books
router.get('/books', (req, res) => {
  const books = getBooks()
  const reservedBooks = getReservedBooks()
  const query = req.query.query?.toLowerCase() || ''
  // Filter books by title or author let filteredBooks = books

  const filteredBooks = query
    ? books.filter(
        book =>
          book.title.toLowerCase().includes(query) ||
          book.author.toLowerCase().includes(query)
      )
    : books

  res.render('books.ejs', {
    books: filteredBooks,
    query: req.query.query || '',
    reservedBooks
  })
})

// GET Reserved books
router.get('/reserve', (req, res) => {
  const reservedBooks = getReservedBooks()
  res.render('reservedBooks.ejs', { reservedBooks, error: null, success: null })
})

// POST Reserved Books
router.post('/reserve', (req, res) => {
  const { title, author, description, date, image } = req.body

  const orderID = Date.now()
  const newResevedBook = {
    id: orderID,
    title,
    author,
    description,
    date,
    image
  }
  const reservedBooks = getReservedBooks()

  if (
    reservedBooks.some(
      book => book.title.toLowerCase() === newResevedBook.title.toLowerCase()
    )
  ) {
    return res.render('reservedBooks.ejs', {
      reservedBooks,
      error: 'This book is already reserved!',
      success: false
    })
  } else {
    reservedBooks.push(newResevedBook)

    try {
      fs.writeFileSync(
        path.join(__dirname, '../data/reservedBooks.json'),
        JSON.stringify(reservedBooks, null, 2)
      )
      return res.render('reservedBooks.ejs', {
        reservedBooks,
        error: false,
        success: 'Book reserved successfully!'
      })
    } catch (error) {
      console.error('Error reserving the book:', error)
      return res.status(500).send('Error saving data.')
    }
  }
})

// DELETE reserved book
router.post('/removeservedBook', (req, res) => {
  const { id } = req.body
  const reservedBooks = getReservedBooks()

  const filteredBooks = reservedBooks.filter(book => book.id !== Number(id))

  try {
    fs.writeFileSync(
      path.join(__dirname, '../data/reservedBooks.json'),
      JSON.stringify(filteredBooks, null, 2)
    )
    res.redirect('/reserve')
  } catch (err) {
    console.error('Error removing book:', err)
    res.status(500).send('Error removing book.')
  }
})

/* -------------------------- ORDERS ------------------------- */

// GET CART
router.get('/cart', (req, res) => {
  const cartItems = req.session.currentorder || []
  res.render('cart.ejs', { cartItems })
})

// POST Cart
router.post('/addToCart', (req, res) => {
  const { name, image, date, amount } = req.body
  const amountNumber = parseInt(amount, 10) || 1
  const cartItem = { id: Date.now(), name, image, date, amount: amountNumber }

  if (!req.session.currentorder) {
    req.session.currentorder = []
  }

  const existing = req.session.currentorder.find(d => d.name === name)

  if (existing) {
    existing.amount += amountNumber
  } else {
    req.session.currentorder.push(cartItem)
  }

  res.redirect('/cart')
})

// REMOVE FROM CART
router.post('/removeFromCart', (req, res) => {
  const { id } = req.body
  if (req.session.currentorder) {
    req.session.currentorder = req.session.currentorder.filter(
      item => item.id !== parseInt(id)
    )
  }

  res.redirect('/cart')
})

// POST ORDER
router.post('/order', (req, res) => {
  const cartItems = req.session.currentorder || []
  const order = {
    id: Date.now(),
    data: new Date().toISOString(),
    items: cartItems
  }

  if (cartItems.length === 0) {
    return res.status(400).send('Cart is empty.')
  }

  const existingOrders = loadOrders() // Load existing
  existingOrders.push(order)

  try {
    fs.writeFileSync(
      path.join(__dirname, '../data/orders.json'),
      JSON.stringify(existingOrders, null, 2)
    )

    req.session.currentorder = [] // Clear cart
    res.redirect('/orders')
  } catch (err) {
    console.error('Error saving order:', err)
    res.status(500).send('Error saving data.')
  }
})

//GET orders
router.get('/orders', (req, res) => {
  const orders = loadOrders()
  res.render('order', { orders })
})

// Delete an order
router.post('/removeOrder', (req, res) => {
  const { id } = req.body
  const existingOrders = loadOrders()
  const filteredOrders = existingOrders.filter(order => order.id !== Number(id))

  try {
    fs.writeFileSync(
      path.join(__dirname, '../data/orders.json'),
      JSON.stringify(filteredOrders, null, 2)
    )
    res.redirect('/orders')
  } catch (err) {
    console.error('Error removing order:', err)
    res.status(500).send('Error removing order.')
  }
})

/*--------------------CONTACT----------------- */

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact')
})

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body
  res.send(`<h1>Thank you, ${name}! We received your message.</h1>`)
})

/*--------------------ABOUT----------------- */
router.get('/about', (req, res) => {
  res.render('about.ejs')
})

// Add Drinks to Favorties

export default router
