import { Router } from 'express'
import fs, { read } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import {
  getRandomDrink,
  loadDrinks,
  loadOrders
} from '../cotrollers/drinksControllers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/user.json'), 'utf-8')
)

// HOME
router.get('/', (req, res) => {
  const currentUser = users[1]

  const drinks = loadDrinks()
  const randomIndex = Math.floor(Math.random() * drinks.length)
  const randomDrink = drinks[randomIndex]

  // Load taglines from the JSON file
  const taglines = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../data/taglines.json'), 'utf8')
  )

  // Pick a random tagline
  const randomTagline = taglines[Math.floor(Math.random() * taglines.length)]

  console.log(randomTagline)
  res.render('index', {
    username: currentUser.username,
    randomDrink,
    randomTagline
  })
})

// Get best seller of the week

// End of HOME

// Get All Drinks with filtering
router.get('/drinksMenu', (req, res) => {
  let drinks = loadDrinks()
  //  filter the drinks
  console.log(req.query)
  const selectedCategory = req.query.category || ''
  if (selectedCategory) {
    drinks = drinks.filter(p => p.category === selectedCategory)
  }
  res.render('drinkMenu', { drinks, selectedCategory })
})

// Add Drink to order
const orders = []
router.post('/order', (req, res) => {
  const { name, image, date, amount } = req.body

  const orderID = Date.now()

  const newOrder = { id: orderID, name, image, date, amount }
  console.log('Order received:', { name, date, image, amount })

  const orders = loadOrders() // Load existing
  orders.push(newOrder)
  try {
    fs.writeFileSync(
      path.join(__dirname, '../data/orders.json'),
      JSON.stringify(orders, null, 2)
    )
    console.log('order saved: ', newOrder)
    res.redirect('/orders')
  } catch (err) {
    console.error('Error saving order:', err)
    res.status(500).send('Error saving data')
  }
})

//GET orders
router.get('/orders', (req, res) => {
  const orders = loadOrders()
  console.log(orders)
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

// Get a random drink
router.get('/random', getRandomDrink)

// Contact page
router.get('/contact', (req, res) => {
  res.render('contact')
})

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body
  console.log('Contact form submitted:', { name, email, message })

  res.send(`<h1>Thank you, ${name}! We received your message.</h1>`)
})

// Add Drinks to Favorties
// Get Favorites
// POST favorite drinks

export default router
