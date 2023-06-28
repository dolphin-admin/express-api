import { sign, verify } from 'jsonwebtoken'

import { GlobalJWTConfig } from '@/shared'

import type { JWTUserModel } from './jwt.model'

export default {
  generateAccessToken: (user: JWTUserModel): string => {
    const { id, username } = user || {}
    if (id <= 0 || !username) {
      throw new Error('Invalid user data, generate token failed!')
    }
    const accessToken = sign({ id, username }, GlobalJWTConfig.JWT_SECRET, {
      expiresIn: `${GlobalJWTConfig.JWT_EXPIRATION}d`
    })

    return accessToken
  },

  validateAccessToken: (authorization: string): JWTUserModel | undefined => {
    if (!authorization) {
      return undefined
    }
    const accessToken = authorization.replace('Bearer', '').trim()
    if (!accessToken) {
      return undefined
    }
    let verifiedResult: JWTUserModel | undefined
    verify(accessToken, GlobalJWTConfig.JWT_SECRET, (error, decoded) => {
      if (error !== null) {
        verifiedResult = undefined
      } else if (decoded) {
        verifiedResult = decoded as JWTUserModel
      } else {
        verifiedResult = undefined
      }
    })

    return verifiedResult
  }
}
