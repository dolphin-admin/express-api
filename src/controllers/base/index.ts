import { Request, Response } from 'express'

import { Controller, Get } from '@/decorators'

@Controller('/')
class BaseController {
  @Get('/')
  async home(req: Request, res: Response) {
    const { t } = req
    res.status(200).send(t('Welcome'))
  }
}

export default new BaseController()
