import express from 'express'
import morgan from 'morgan'
import router from './routes/index.js'
import bodyParser from 'body-parser'
import session from 'express-session'
const app = express()
const PORT = process.env.PORT || 3000

app.use(morgan('dev'))
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(
  session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: true
  })
)
app.set('view engine', 'ejs')

app.use('/', router)
app.listen(PORT, () => {
  console.log(`Server is listening on port: ${PORT}`)
})
