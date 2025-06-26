import fs from 'fs'
import path from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const loadDrinks = () => {
  const drinksJson = readFileSync(
    path.join(__dirname, '../data/drinks.json'),
    'utf-8'
  )
  let drinks = JSON.parse(drinksJson)
  return drinks
}

// Helper to load existing orders
export const loadOrders = () => {
  const ordersFile = path.join(__dirname, '../data/orders.json')
  if (!fs.existsSync(ordersFile)) {
    return [] // Return empty if file doesn't exist
  }
  const data = fs.readFileSync(ordersFile, 'utf-8')

  try {
    return JSON.parse(data)
  } catch (err) {
    console.error('Error parsing orders.json:', err)
    return [] // Fail-safe fallback
  }
}

// Get a random Drink
export const getRandomDrink = (req, res) => {
  const drinks = loadDrinks()
  const randomIndex = Math.floor(Math.random() * drinks.length)
  const randomDrink = drinks[randomIndex]
  return randomDrink
}
