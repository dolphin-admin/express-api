import { sign, verify } from 'jsonwebtoken'

import { GlobalJWTConfig } from '@/shared'

import type { JWTUserModel } from './jwt.model'

export default {
  generateAccessToken: (user: JWTUserModel): string => {
    const { id, username, roles } = user || {}
    if (id <= 0 || !username || !Array.isArray(roles) || roles.length <= 0) {
      throw new Error('Invalid user data, generate token failed!')
    }
    const accessToken = sign({ id, username, roles }, GlobalJWTConfig.JWT_SECRET, {
      expiresIn: GlobalJWTConfig.JWT_EXPIRATION
    })

    return accessToken
  },

  validateAccessToken: (request: Request): JWTUserModel | undefined => {
    const bearerToken = request.headers.get('authorization')
    if (!bearerToken) {
      return undefined
    }
    const accessToken = bearerToken.split(' ')[1]
    if (!accessToken) {
      return undefined
    }
    let verifyResult: JWTUserModel | undefined
    verify(accessToken, GlobalJWTConfig.JWT_SECRET, (error, decoded) => {
      if (error !== null) {
        verifyResult = undefined
      } else if (decoded) {
        verifyResult = decoded as JWTUserModel
      } else {
        verifyResult = undefined
      }
    })
    return verifyResult
  }
}
