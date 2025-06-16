import fs from 'fs'
import path from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const loadDrinks = () => {
  const drinksJson = readFileSync(
    path.join(__dirname, '../drinks.json'),
    'utf-8'
  )
  let drinks = JSON.parse(drinksJson)
  return drinks
}
