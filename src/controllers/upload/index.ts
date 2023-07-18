import { Request } from 'express'

import { Auth, Controller, Post, UploadFile, UploadFiles } from '@/decorators'
import { UploadService } from '@/services'
import { BaseResponse } from '@/types'

@Controller('/upload')
@Auth()
class UploadController {
  /**
   * 上传文件
   */
  @UploadFile()
  @Post('/')
  async uploadFile(request: Request, response: BaseResponse<Express.Multer.File>) {
    const { file, t } = request

    if (!file) {
      response.status(400).json({
        message: t('File.Require')
      })
      return
    }

    // 打印日志到 console
    UploadService.logFileInfo(file)

    // 生成文件访问路径
    file.path = UploadService.getFilePath(file.path)

    response.json({
      data: file,
      message: t('Upload.Success')
    })
  }

  /**
   * 批量上传文件
   */
  @UploadFiles()
  @Post('/batch')
  async uploadFiles(request: Request, response: BaseResponse<Express.Multer.File[]>) {
    const { files, t } = request

    if (!files || !Array.isArray(files) || files.length === 0) {
      response.status(400).json({
        message: t('Files.Require')
      })
      return
    }

    // 打印日志到 console
    files.forEach((file) => UploadService.logFileInfo(file))

    // 生成文件访问路径
    const filesWithPath = files.map((file) => ({
      ...file,
      path: UploadService.getFilePath(file.path)
    }))

    response.json({
      data: filesWithPath,
      message: t('Upload.Success')
    })
  }
}

export default new UploadController()
