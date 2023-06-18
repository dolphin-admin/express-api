import type { Router } from 'express'
import express from 'express'

import type { JWTUserModel } from '@/core'
import { JWTManager } from '@/core'
import type { UserSignupInputModel, UserSignupResponse } from '@/services'
import { UsersService } from '@/services'
import type { BaseRequest } from '@/types'

const router: Router = express.Router()

router.post('/', async (request: BaseRequest, response: UserSignupResponse) => {
  const { username, password, confirmPassword } = request.body as UserSignupInputModel

  if (!username?.trim() || !password?.trim() || !confirmPassword?.trim()) {
    response.status(400).json({
      message: 'Username, password and confirm password are required.'
    })
    return
  }

  if (username.trim().length < 4) {
    response.status(400).json({
      message: 'Username must be at least 6 characters.'
    })
    return
  }

  if (password.trim().length < 6) {
    response.status(400).json({
      message: 'Password must be at least 6 characters.'
    })
    return
  }

  if (confirmPassword !== password) {
    response.status(400).json({
      message: 'Confirm password does not match.'
    })
    return
  }

  // Check if username already exists
  const { isExist } = await UsersService.alreadyExists(username)
  if (isExist) {
    response.status(400).json({
      message: 'Username already exists.'
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
      message: 'Error generating token.'
    })
    return
  }

  response.status(201).json({
    data: {
      user: UsersService.filterSafeUserInfo(user),
      accessToken
    }
  })
})

export default router
