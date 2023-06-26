import type { Request, Router } from 'express'
import express from 'express'

const router: Router = express.Router()

router.get('/', async (_: Request) => {})

export default router
