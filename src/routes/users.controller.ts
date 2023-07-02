import type { User } from '@prisma/client'
import { Prisma } from '@prisma/client'
import type { Request, Router } from 'express'
import express from 'express'

import type { JWTUserModel } from '@/core'
import { JWTManager } from '@/core'
import type {
  OmitPassword,
  PageUserModel,
  UserSignupInputModel,
  UserSignupResponse,
  UserUpdateInputBaseModel
} from '@/services'
import { UsersService } from '@/services'
import { passwordHash } from '@/shared'
import type { BasePageResponse, BaseResponse, PageRequestModel } from '@/types'

const router: Router = express.Router()

router.get('/', async (request: Request, response: BasePageResponse<PageUserModel[]>) => {
  const { t, lang } = request
  const { page, pageSize } = request.query
  if (!page || !pageSize) {
    response.status(400).json({
      message: t('Page.Require')
    })
    return
  }

  if (typeof Number(page) !== 'number' || typeof Number(pageSize) !== 'number') {
    response.status(400).json({
      message: t('Page.Invalid')
    })
    return
  }

  const pageModel: PageRequestModel = {
    page: Number(page),
    pageSize: Number(pageSize)
  }

  const { users, ...pageResult } = await UsersService.getUsers(pageModel, { t, lang })

  response.status(200).json({
    data: users,
    ...pageResult
  })
})

router.get('/:id(\\d+)', async (request: Request, response: BaseResponse<OmitPassword<User>>) => {
  const { t } = request
  const id = parseInt(request.params.id, 10)

  const user = await UsersService.getUserById(id)
  if (user) {
    response.status(200).json({
      data: UsersService.filterSafeUserInfo(user)
    })
  } else {
    response.status(404).json({
      message: t('User.NotExist')
    })
  }
})

router.get('/info', async (request: Request, response: BaseResponse<OmitPassword<User>>) => {
  const { t } = request
  if (!request.currentUser) {
    response.status(404).json({
      message: t('User.NotExist')
    })
    return
  }

  response.status(200).json({
    data: UsersService.filterSafeUserInfo(request.currentUser)
  })
})

router.post('/', async (request: Request, response: UserSignupResponse) => {
  const { t, currentUser } = request
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
        password: await passwordHash(password)
      },
      { currentUser }
    )

    // Generate JWT token
    const jwtUserModel: JWTUserModel = {
      id: user.id,
      username: user.username
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

router.put('/:id(\\d+)', async (request: Request, response: BaseResponse<OmitPassword<User>>) => {
  const { t, currentUser } = request
  const id = parseInt(request.params.id, 10)
  if (!id) {
    response.status(400).json({
      message: t('User.ID.Require')
    })
    return
  }

  const { email, name, firstName, lastName, gender, phoneNumber, birthDate, address, avatarUrl, biography } =
    request.body as UserUpdateInputBaseModel

  try {
    const user = await UsersService.updateUser(
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
      { currentUser }
    )
    if (!user) {
      response.status(404).json({
        message: t('User.NotExist')
      })
      return
    }

    response.status(200).json({
      data: UsersService.filterSafeUserInfo(user),
      message: t('User.Updated')
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        response.status(404).json({
          message: t('User.NotExist')
        })
      }
      return
    }
    console.log(error)
    response.status(500).json({
      message: t('User.UpdateFailed')
    })
  }
})

router.delete('/:id(\\d+)', async (request: Request, response: BaseResponse) => {
  const { t, currentUser } = request
  const id = parseInt(request.params.id, 10)
  if (!id) {
    response.status(400).json({
      message: t('User.ID.Require')
    })
    return
  }

  try {
    const user = await UsersService.deleteUser(id, { currentUser })
    if (!user) {
      response.status(404).json({
        message: t('User.NotExist')
      })
      return
    }

    response.status(200).json({
      message: t('User.Deleted')
    })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        response.status(404).json({
          message: t('User.NotExist')
        })
      }
      return
    }
    console.log(error)
    response.status(500).json({
      message: t('User.DeleteFailed')
    })
  }
})

export default router
