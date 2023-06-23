import type { User } from '@prisma/client'
import type { Request, Response, Router } from 'express'
import express from 'express'

import type { JWTUserModel } from '@/core'
import { JWTManager } from '@/core'
import type { UserSafeModel, UserSignupInputModel, UserSignupResponse, UserUpdateInputBaseModel } from '@/services'
import { UsersService } from '@/services'
import type { BasePageResponse, BaseResponse, PageRequestModel } from '@/types'

const router: Router = express.Router()

router.get('/', async (request: Request, response: BasePageResponse<UserSafeModel[]>) => {
  const { t } = request
  const { pageNum, pageSize } = request.query

  if (!pageNum || !pageSize) {
    response.status(400).json({
      message: t('Page.Require')
    })
    return
  }

  if (typeof Number(pageNum) !== 'number' || typeof Number(pageSize) !== 'number') {
    response.status(400).json({
      message: t('Page.Invalid')
    })
    return
  }

  const pageModel: PageRequestModel = {
    pageNum: Number(pageNum),
    pageSize: Number(pageSize)
  }

  const { users, ...pageResult } = await UsersService.getUsers(pageModel)

  response.status(200).json({
    data: users.map((user) => UsersService.filterSafeUserInfo(user)),
    ...pageResult
  })
})

router.get('/:id', async (request: Request, response: BaseResponse<User>) => {
  const { t } = request
  const id = Number(request.params.id)
  const user = await UsersService.getUserById(id)
  if (user) {
    response.status(200).json({
      data: user
    })
  } else {
    response.status(404).json({
      message: t('User.NotExist')
    })
  }
})

router.post('/', async (request: Request, response: UserSignupResponse) => {
  const { t } = request
  const { username, password, confirmPassword } = request.body as UserSignupInputModel

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
  if ((await UsersService.alreadyExists(username)).isExist) {
    response.status(409).json({
      message: t('Username.AlreadyExist')
    })
    return
  }

  try {
    const user = await UsersService.createUser(
      {
        username,
        password: await UsersService.passwordHash(password)
      },
      { request }
    )

    // Generate JWT token
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
      message: t('User.Created')
    })
  } catch (error) {
    console.log(error)
    response.status(500).json({
      message: t('User.CreateFailed')
    })
  }
})

router.put('/:id', async (request: Request, response: Response) => {
  const { t } = request
  const id = Number(request.params.id)

  if (!id) {
    response.status(400).json({
      message: t('User.ID.Require')
    })
    return
  }

  const { email, name, firstName, lastName, gender, phoneNumber, birthDate, address, avatarUrl, biography } =
    request.body as UserUpdateInputBaseModel

  try {
    await UsersService.updateUser(
      id,
      {
        email,
        name,
        firstName,
        lastName,
        gender,
        phoneNumber,
        birthDate,
        address,
        avatarUrl,
        biography
      },
      { request }
    )
    response.status(200).json({
      message: t('User.Updated')
    })
  } catch (error) {
    console.log(error)
    response.status(500).json({
      message: t('User.UpdateFailed')
    })
  }
})

router.delete('/:id', async (request: Request, response: BaseResponse) => {
  const { t } = request
  const id = Number(request.params.id)
  if (!id) {
    response.status(400).json({
      message: t('User.ID.Require')
    })
    return
  }

  try {
    await UsersService.deleteUser(id, { request })
    response.status(200).json({
      message: t('User.Deleted')
    })
  } catch (error) {
    console.log(error)
    response.status(500).json({
      message: t('User.DeleteFailed')
    })
  }
})

export default router
