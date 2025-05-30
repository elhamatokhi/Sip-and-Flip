import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json([{ name: 'Elhama' }, { name: 'Alex' }])
})

export default router
