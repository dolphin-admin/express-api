import type { Request, Router } from 'express'
import express from 'express'

import type { JWTUserModel } from '@/core'
import { JWTManager } from '@/core'
import type { UserSignupInputModel, UserSignupResponse } from '@/services'
import { UsersService } from '@/services'

const router: Router = express.Router()

router.post('/', async (request: Request, response: UserSignupResponse) => {
  const { t } = request
  const { username, password, confirmPassword } = request.body as UserSignupInputModel

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
  if (!confirmPassword?.trim()) {
    response.status(400).json({
      message: t('ConfirmPassword.Require')
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

  if (confirmPassword !== password) {
    response.status(400).json({
      message: t('ConfirmPassword.NotMatch')
    })
    return
  }

  // Check if username already exists
  const { isExist } = await UsersService.alreadyExists(username)
  if (isExist) {
    response.status(400).json({
      message: t('Username.AlreadyExist')
    })
    return
  }

  const user = await UsersService.createUser({
    username,
    password: await UsersService.passwordHash(password)
  })

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

  response.status(201).json({
    data: {
      user: UsersService.filterSafeUserInfo(user),
      accessToken
    },
    message: t('Signup.Success')
  })
})

export default router
