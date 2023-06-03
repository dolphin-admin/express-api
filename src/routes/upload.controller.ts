import type { Router } from 'express'
import express from 'express'

import { UploadService } from '@/services/upload'
import { baseUpload } from '@/shared'
import type { BaseRequest, BaseResponse } from '@/types'

const router: Router = express.Router()

router.post(
  '/',
  baseUpload.single('file'),
  async (request: BaseRequest, response: BaseResponse<Express.Multer.File>) => {
    const { file } = request
    if (!file) {
      response.status(400).json({
        message: 'File is required.'
      })
      return
    }

    UploadService.logFileInfo(file)

    response.json({
      data: file
    })
  }
)

router.post(
  '/batch',
  baseUpload.array('files'),
  async (request: BaseRequest, response: BaseResponse<Express.Multer.File[]>) => {
    const { files } = request

    if (!files || !Array.isArray(files) || files.length === 0) {
      response.status(400).json({
        message: 'Files are required.'
      })
      return
    }

    files.map((file) => UploadService.logFileInfo(file))

    response.json({
      data: files
    })
  }
)

export default router
