import type { Request, Router } from 'express'
import express from 'express'

import type { JWTUserModel } from '@/core'
import { JWTManager } from '@/core'
import type { UserLoginInputModel, UserLoginResponse } from '@/services'
import { UsersService } from '@/services'

const router: Router = express.Router()

router.get('/', async (request: Request, response: UserLoginResponse) => {
  const { username, password } = request.body as UserLoginInputModel

  if (!username?.trim() || !password?.trim()) {
    response.status(400).json({
      message: 'Username and password are required.'
    })
    return
  }

  if (username.trim().length < 6) {
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

  // Check if username already exists
  const { isExist, user } = await UsersService.alreadyExists(username)
  if (!isExist || !user) {
    response.status(400).json({
      message: 'Username does not exist.'
    })
    return
  }

  if (!(await UsersService.passwordEquals(password, user.password))) {
    response.status(400).json({ message: 'Password is incorrect.' })
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
      message: 'Error generating token.'
    })
    return
  }

  response.status(200).json({
    data: {
      user: UsersService.filterSafeUserInfo(user),
      accessToken
    }
  })
})

export default router
