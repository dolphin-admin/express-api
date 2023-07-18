import { batchLog, GlobalAppConfig, LOG_PREFIX } from '@/shared'

class UploadService {
  logFileInfo(file: Express.Multer.File) {
    const { mimetype, originalname, size, path } = file

    batchLog([
      `${LOG_PREFIX} Upload successfully!`,
      '-------------------- File Info --------------------',
      `${LOG_PREFIX} Mime Type: ${mimetype}`,
      `${LOG_PREFIX} Original Name: ${originalname}`,
      `${LOG_PREFIX} File Size: ${size}`,
      `${LOG_PREFIX} File Path: ${path}`,
      '---------------------------------------------------'
    ])
  }

  getFilePath(path: string) {
    return `${GlobalAppConfig.APP_BASE_URL}/${path}`
  }
}

export default new UploadService()
