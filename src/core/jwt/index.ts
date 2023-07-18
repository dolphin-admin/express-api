import { sign, verify } from 'jsonwebtoken'

import { GlobalJWTConfig } from '@/shared'
import type { JWTModel } from '@/types'

class JWTManager {
  generateAccessToken(user: JWTModel): string | null {
    const { id, username } = user || {}
    if (id <= 0 || !username) {
      return null
    }
    const accessToken = sign({ id, username }, GlobalJWTConfig.JWT_SECRET, {
      expiresIn: `${GlobalJWTConfig.JWT_EXPIRATION}d`
    })
    return accessToken
  }

  validateAccessToken(authorization: string): JWTModel | undefined {
    if (!authorization) {
      return undefined
    }
    const accessToken = authorization.replace('Bearer', '').trim()
    if (!accessToken) {
      return undefined
    }
    let verifiedResult: JWTModel | undefined
    verify(accessToken, GlobalJWTConfig.JWT_SECRET, (error, decoded) => {
      if (error !== null) {
        verifiedResult = undefined
      } else if (decoded) {
        verifiedResult = decoded as JWTModel
      } else {
        verifiedResult = undefined
      }
    })
    return verifiedResult
  }
}

export default new JWTManager()
