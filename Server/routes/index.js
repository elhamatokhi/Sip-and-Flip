import { Router } from 'express'
import fs, { read } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  getRandomDrink,
  loadDrinks,
  loadOrders
} from '../cotrollers/drinksControllers.js'

import { getRandomUser } from '../cotrollers/userControllers.js'

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

  console.log(user, drink)

  // Pick a random tagline
  const randomTagline = taglines[Math.floor(Math.random() * taglines.length)]

  res.render('index', {
    drink,
    user,
    randomTagline,
    greeting: `Hi, ${user.username}!`
  })
})

// Get best seller of the week

// End of HOME

// Get All Drinks with filtering
router.get('/drinksMenu', (req, res) => {
  // Get all the drinks
  let drinks = loadDrinks()
  //  filter the drinks

  const selectedCategory = req.query.category || ''
  if (selectedCategory) {
    drinks = drinks.filter(p => p.category === selectedCategory)
  }
  res.render('drinkMenu', { drinks, selectedCategory })
})

// Add Drink to order
router.post('/order', (req, res) => {
  const { name, image, date, amount } = req.body
  const orderID = Date.now() // Generate a new ID for each order
  const newOrder = { id: orderID, name, image, date, amount }

  const existingOrders = loadOrders() // Load existing
  existingOrders.push(newOrder)
  try {
    fs.writeFileSync(
      path.join(__dirname, '../data/orders.json'),
      JSON.stringify(existingOrders, null, 2)
    )

    res.redirect('/orders')
  } catch (err) {
    console.error('Error saving order:', err)
    res.status(500).send('Error saving data')
  }
})

//GET orders
router.get('/orders', (req, res) => {
  const orders = loadOrders()
  res.render('order', { orders })
})

// GET Drink Details
router.get('/orders/:id', (req, res) => {
  const orders = loadOrders()
  const ID = Number(req.params.id)

  const order = orders.find(o => o.id === ID)
  if (!order) {
    return res.status(404).send('Order not found')
  }
  res.render('drinkDetails', { order })
})

// Get Favorites
router.get('/favorites', (req, res) => {
  res.render('favorites')
})

// Add Drinks to Favorties

// Get a random drink
router.get('/random', getRandomDrink)

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact')
})

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body
  res.send(`<h1>Thank you, ${name}! We received your message.</h1>`)
})

export default router
