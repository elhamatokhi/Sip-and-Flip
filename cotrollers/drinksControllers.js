import fs from 'fs'
import path from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import axios from 'axios'
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

// Load existing orders
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
    return []
  }
}

// Get a random Drink
export const getRandomDrink = (req, res) => {
  const drinks = loadDrinks()
  const randomIndex = Math.floor(Math.random() * drinks.length)
  const randomDrink = drinks[randomIndex]
  return randomDrink
}

// Get drink details from wikipedia

export async function getWikipediaData (drinkName) {
  try {
    const response = await axios.get(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
        drinkName
      )}`
    )

    if (
      response.data.type ===
      'https://mediawiki.org/wiki/HyperSwitch/errors/not_found'
    ) {
      return {
        summary: 'No Wikipedia summary found.',
        image: null,
        wikipediaUrl: null
      }
    }

    return {
      summary: response.data.extract,
      image: response.data.thumbnail?.source || null,
      wikipediaUrl: response.data.content_urls.desktop.page
    }
  } catch (error) {
    console.error(
      `Error fetching Wikipedia data for ${drinkName}:`,
      error.message
    )
    return {
      summary: 'No Wikipedia information available.',
      image: null,
      wikipediaUrl: null
    }
  }
}
