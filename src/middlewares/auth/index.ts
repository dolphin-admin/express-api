import type { NextFunction, Request } from 'express'

import { JWTManager } from '@/core'
import { UsersService } from '@/services'
import type { BaseResponse } from '@/types'

/**
 * 验证 token 中间件
 */
export const validateToken = async (request: Request, response: BaseResponse, next: NextFunction) => {
  const { authorization } = request.headers

  if (!authorization) {
    response.status(401).json({ message: 'Token not found!' })
    return
  }

  // 验证 token 是否有效
  const verifiedResult = JWTManager.validateAccessToken(authorization)
  if (!verifiedResult) {
    response.status(401).json({ message: 'Invalid token!' })
    return
  }

  // 获取当前用户信息
  const userId = verifiedResult.id
  const user = await UsersService.getUserById(userId)
  if (user) {
    // 将当前用户信息挂载到 request 对象上，便于后续接口路由使用
    request.currentUser = user
  }

  next()
}
