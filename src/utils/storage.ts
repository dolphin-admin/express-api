import multer from 'multer'

import { GlobalFileStorageConfig } from './config'
import { generateUUID } from './uuid'

// 文件扩展名映射
const extensionMap = new Map([
  ['text/plain', '.txt'],
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/gif', '.gif'],
  ['image/bmp', '.bmp'],
  ['image/webp', '.webp'],
  ['image/svg+xml', '.svg'],
  ['application/pdf', '.pdf'],
  ['application/msword', '.doc'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', '.docx'],
  ['application/vnd.ms-excel', '.xls'],
  ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', '.xlsx'],
  ['application/vnd.ms-powerpoint', '.ppt'],
  ['application/vnd.openxmlformats-officedocument.presentationml.presentation', '.pptx'],
  ['application/zip', '.zip']
])

/**
 * 基础文件上传配置
 */
const baseStorage = multer.diskStorage({
  destination(request, file, callback) {
    callback(null, GlobalFileStorageConfig.FILE_STORAGE_PATH)
  },
  filename(request, file, callback) {
    callback(null, `${generateUUID()}${extensionMap.get(file.mimetype)}`)
  }
})

/**
 * 文件过滤器
 */
const fileFilter = (request: any, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  if (extensionMap.get(file.mimetype)) {
    callback(null, true)
  } else {
    callback(new Error('Invalid file type.'))
  }
}

export const baseUpload = multer({ storage: baseStorage, fileFilter })
