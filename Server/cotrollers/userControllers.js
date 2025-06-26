import fs from 'fs'
import path from 'path'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const loadUsers = () => {
  const data = fs.readFileSync(
    path.join(__dirname, '../data/user.json'),
    'utf-8'
  )
  return JSON.parse(data)
}

// Pick a random user

export const getRandomUser = () => {
  const users = loadUsers()
  const randomUserIndex = Math.floor(Math.random() * users.length)
  return users[randomUserIndex]
}
