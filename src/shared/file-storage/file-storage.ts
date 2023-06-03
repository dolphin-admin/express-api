import multer from 'multer'

import { GlobalFileStorageConfig } from '../config'
import { generateUUID } from '../uuid'
import { extensionMap } from './extension.private'

const baseStorage = multer.diskStorage({
  destination(request, file, callback) {
    callback(null, GlobalFileStorageConfig.FILE_STORAGE_PATH)
  },
  filename(request, file, callback) {
    callback(null, `${generateUUID()}${extensionMap.get(file.mimetype)}`)
  }
})

const fileFilter = (request: any, file: Express.Multer.File, callback: multer.FileFilterCallback) => {
  if (extensionMap.get(file.mimetype)) {
    callback(null, true)
  } else {
    callback(new Error('Invalid file type.'))
  }
}

const baseUpload = multer({ storage: baseStorage, fileFilter })

export { baseUpload }
