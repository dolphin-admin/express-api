import { batchLog, LOG_PREFIX } from '@/shared'
// export const processUploadFile = async (file: File): Promise<Upload> => {}

export const logFileInfo = (file: Express.Multer.File) => {
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
