import type { Request, Router } from 'express'
import express from 'express'

import type { JWTUserModel } from '@/core'
import { JWTManager } from '@/core'
import type { UserLoginInputModel, UserLoginResponse } from '@/services'
import { UsersService } from '@/services'

const router: Router = express.Router()

router.post('/', async (request: Request, response: UserLoginResponse) => {
  const { t } = request
  const { username, password } = request.body as UserLoginInputModel

  if (!username?.trim()) {
    response.status(400).json({
      message: t('Username.Require')
    })
    return
  }

  if (!password?.trim()) {
    response.status(400).json({
      message: t('Password.Require')
    })
    return
  }

  if (username.trim().length < 4) {
    response.status(400).json({
      message: t('Username.MaxLength')
    })
    return
  }

  if (password.trim().length < 6) {
    response.status(400).json({
      message: t('Password.MaxLength')
    })
    return
  }

  // Check if username already exists
  const { isExist, user } = await UsersService.alreadyExists(username)
  if (!isExist || !user) {
    response.status(400).json({
      message: t('Username.NotExist')
    })
    return
  }

  if (!(await UsersService.passwordEquals(password, user.password))) {
    response.status(400).json({
      message: t('Password.Incorrect')
    })
    return
  }

  const jwtUserModel: JWTUserModel = {
    id: user.id,
    username: user.username,
    roles: user.roles
  }
  const accessToken = JWTManager.generateAccessToken(jwtUserModel)
  if (!accessToken) {
    response.status(401).json({
      message: t('Token.Generate.Failed')
    })
    return
  }

  response.status(200).json({
    data: {
      user: UsersService.filterSafeUserInfo(user),
      accessToken
    },
    message: t('Login.Success')
  })
})

export default router
