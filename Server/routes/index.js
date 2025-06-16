import { Router } from 'express'
import fs, { read } from 'fs'
import path from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { loadDrinks } from '../cotrollers/drinksControllers.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const router = Router()

// HOME
router.get('/', (req, res) => {
  res.render('index')
})

export default router
