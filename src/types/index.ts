// NOTE: Written global types here.
import type { User } from '@prisma/client'
import type { Response } from 'express'

import type { Lang, MessageSchema } from './i18n'

// Base response types
interface ErrorResponseModel {
  code?: number | string
  message?: string
}

interface BaseResponseModel<T> extends ErrorResponseModel {
  data: T
}

export type BaseResponse<T = any> = Response<BaseResponseModel<T> | ErrorResponseModel>

// Pagination response types
export interface PageRequestModel {
  page: number
  pageSize: number
  searchText?: string
}

export interface PageResponseModel extends PageRequestModel {
  total: number
}

export type BasePageResponse<T = any> = Response<(BaseResponseModel<T> & PageResponseModel) | ErrorResponseModel>

export interface ServiceOptions {
  currentUser?: User
  lang?: Lang
  t?(key: MessageSchema, lang?: Lang): string
}

export * from './i18n'
