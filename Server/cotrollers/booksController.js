import fs, { readFileSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const getBooks = () => {
  const books = fs.readFileSync(
    path.join(__dirname, '../data/books.json'),
    'utf-8'
  )
  return JSON.parse(books)
}

// Get reserved books
export const getReservedBooks = () => {
  const filePath = path.join(__dirname, '../data/reservedBooks.json')

  const reservedBooks = fs.readFileSync(filePath, 'utf-8')
  return JSON.parse(reservedBooks)
}
