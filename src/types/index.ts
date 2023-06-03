// NOTE: Written global types here.
import type { User } from '@prisma/client'
import type { Request, Response } from 'express'

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
  pageNum: number
  pageSize: number
}

export interface PageResponseModel extends PageRequestModel {
  total: number
}

export type BasePageResponse<T = any> = Response<(BaseResponseModel<T> & PageResponseModel) | ErrorResponseModel>

export interface BaseRequest extends Request {
  currentUser?: User
}

export interface ServiceOptions {
  request?: BaseRequest
}
