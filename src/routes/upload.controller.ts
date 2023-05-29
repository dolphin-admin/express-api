import type { Router } from 'express'
import express from 'express'

import type { BaseResponse } from '@/types'

const router: Router = express.Router()

router.post('/', async (request: Request, response: BaseResponse<>) => {})

router.post('/batch', async (request: Request, response: BaseResponse<>) => {})

export default router
