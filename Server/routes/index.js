import { Router } from 'express'
import fs, { read } from 'fs'
import path from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { getRandomDrink, loadDrinks } from '../cotrollers/drinksControllers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()

const users = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../data/user.json'), 'utf-8')
)

// HOME
router.get('/', (req, res) => {
  const currentUser = users[0]

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

// Get best seller of the week

// Get a random drink
router.get('/random', getRandomDrink)
// Get Favorites

// POST favorite drinks

//GET orders
router.get('/orders', (req, res) => {
  res.render('order')
})
// POSt order

export default router
