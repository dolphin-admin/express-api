import type { Request, Router } from 'express'
import express from 'express'

import { UploadService } from '@/services/upload'
import { baseUpload } from '@/shared'
import type { BaseResponse } from '@/types'

const router: Router = express.Router()

router.post('/', baseUpload.single('file'), async (request: Request, response: BaseResponse<Express.Multer.File>) => {
  const { file, t } = request

  if (!file) {
    response.status(400).json({
      message: t('File.Require')
    })
    return
  }

  UploadService.logFileInfo(file)

  response.json({
    data: file,
    message: t('Upload.Success')
  })
})

router.post(
  '/batch',
  baseUpload.array('files'),
  async (request: Request, response: BaseResponse<Express.Multer.File[]>) => {
    const { files, t } = request

    if (!files || !Array.isArray(files) || files.length === 0) {
      response.status(400).json({
        message: t('Files.Require')
      })
      return
    }

    files.map((file) => UploadService.logFileInfo(file))

    response.json({
      data: files,
      message: t('Upload.Success')
    })
  }
)

export default router
