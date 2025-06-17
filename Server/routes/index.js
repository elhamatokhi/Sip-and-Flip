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

  res.render('index', { username: currentUser.username, randomDrink })
})

// Get All Drinks with filtering
router.get('/drinksMenu', (req, res) => {
  let drinks = loadDrinks()

  res.render('drinkMenu', { drinks })
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
