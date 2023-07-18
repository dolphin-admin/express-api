import { hash } from '@node-rs/bcrypt'
import axios from 'axios'
import type { Request, Router } from 'express'
import express from 'express'

import type { JWTUserModel } from '@/core'
import { JWTManager } from '@/core'
import type { UserLoginInputModel, UserLoginResponse } from '@/services'
import { UsersService } from '@/services'
import {
  AuthType,
  generateRandomString,
  GlobalAuthConfig,
  passwordEquals,
  prisma,
  SEED_SUPER_ADMIN_PASSWORD
} from '@/shared'

const POST_GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'
const GET_GITHUB_USER_URL = 'https://api.github.com/user'
const POST_GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'
const GET_GOOGLE_USER_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'

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

  if (!(await passwordEquals(password, user.password))) {
    response.status(400).json({
      message: t('Password.Incorrect')
    })
    return
  }

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

  response.status(200).json({
    data: {
      user: UsersService.filterSafeUserInfo(user),
      accessToken
    },
    message: t('Login.Success')
  })
})

router.post('/github', async (request: Request, response: UserLoginResponse) => {
  const { t } = request
  const { code } = request.body as { code: string }

  if (!code) {
    response.status(401).json({
      message: t('GitHub.Authorize.Failed')
    })
    return
  }

  const { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } = GlobalAuthConfig

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    response.status(401).json({
      message: t('GitHub.Config.Missing')
    })
    return
  }

  try {
    const githubTokenResponse = await axios({
      method: 'post',
      url:
        `${POST_GITHUB_TOKEN_URL}?client_id=${GITHUB_CLIENT_ID}&` +
        `client_secret=${GITHUB_CLIENT_SECRET}&` +
        `code=${code}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      }
    })

    const githubToken = githubTokenResponse.data.access_token

    if (!githubToken) {
      response.status(401).json({
        message: t('GitHub.GenerateToken.Failed')
      })
      return
    }

    const githubUserResponse = await axios({
      method: 'get',
      url: GET_GITHUB_USER_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: `Bearer ${githubToken}`
      }
    })

    const githubUserData = githubUserResponse.data
      ? {
          id: githubUserResponse.data.id,
          login: githubUserResponse.data.login,
          name: githubUserResponse.data.name,
          avatarUrl: githubUserResponse.data.avatar_url,
          bio: githubUserResponse.data.bio,
          location: githubUserResponse.data.location
        }
      : null

    if (!githubUserData || !githubUserData.id) {
      response.status(404).json({
        message: t('GitHub.FetchUserData.Failed')
      })
      return
    }

    const authUser = await prisma.auth.findFirst({
      include: {
        user: true
      },
      where: {
        authType: AuthType.GitHub,
        openId: githubUserData.id.toString()
      }
    })

    if (authUser) {
      const shouldChangeAccessToken = authUser.token !== githubToken
      if (shouldChangeAccessToken) {
        await prisma.auth.update({
          where: {
            id: authUser.id
          },
          data: {
            token: githubToken
          }
        })
      }

      const jwtUserModel: JWTUserModel = {
        id: authUser.userId,
        username: authUser.user.username
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
          user: UsersService.filterSafeUserInfo(authUser.user),
          accessToken
        },
        message: t('Login.Success')
      })
    } else {
      const user = await prisma.user.create({
        data: {
          username: `User-${generateRandomString(8)}`,
          password: await hash(SEED_SUPER_ADMIN_PASSWORD, 10),
          name: githubUserData.name ?? githubUserData.login,
          avatarUrl: githubUserData.avatarUrl,
          biography: githubUserData.bio,
          address: githubUserData.location,
          enabled: true,
          verified: true,
          auths: {
            create: {
              authType: AuthType.GitHub,
              token: githubToken,
              openId: githubUserData.id.toString(),
              data: githubUserResponse.data
            }
          }
        }
      })

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

      response.status(200).json({
        data: {
          user: UsersService.filterSafeUserInfo(user),
          accessToken
        },
        message: t('Login.Success')
      })
    }
  } catch (error) {
    console.log(error)
    response.status(401).json({
      message: t('GitHub.Authorize.Failed')
    })
  }
})

router.post('/google', async (request: Request, response: UserLoginResponse) => {
  const { t } = request
  const { code } = request.body as { code: string }

  if (!code) {
    response.status(401).json({
      message: t('Google.Authorize.Failed')
    })
    return
  }

  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_REDIRECT_URL } = GlobalAuthConfig

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET || !GOOGLE_CLIENT_REDIRECT_URL) {
    response.status(401).json({
      message: t('Google.Config.Missing')
    })
    return
  }

  try {
    const requestBody = new URLSearchParams({
      code,
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      redirect_uri: GOOGLE_CLIENT_REDIRECT_URL,
      grant_type: 'authorization_code'
    })

    const googleTokenResponse = await axios({
      method: 'post',
      url: POST_GOOGLE_TOKEN_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json'
      },
      data: requestBody
    })

    const googleToken = googleTokenResponse.data.access_token

    if (!googleToken) {
      response.status(401).json({
        message: t('Google.GenerateToken.Failed')
      })
      return
    }

    const googleUserResponse = await axios({
      method: 'get',
      url: GET_GOOGLE_USER_URL,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Accept: 'application/json',
        Authorization: `Bearer ${googleToken}`
      }
    })

    const googleUserData = googleUserResponse.data
      ? {
          id: googleUserResponse.data.id,
          name: googleUserResponse.data.name,
          firstName: googleUserResponse.data.given_name,
          lastName: googleUserResponse.data.family_name,
          avatarUrl: googleUserResponse.data.picture
        }
      : null

    if (!googleUserData || !googleUserData.id) {
      response.status(404).json({
        message: t('Google.FetchUserData.Failed')
      })
      return
    }

    const authUser = await prisma.auth.findFirst({
      include: {
        user: true
      },
      where: {
        authType: AuthType.Google,
        openId: googleUserData.id.toString()
      }
    })

    if (authUser) {
      const shouldChangeAccessToken = authUser.token !== googleToken
      if (shouldChangeAccessToken) {
        await prisma.auth.update({
          where: {
            id: authUser.id
          },
          data: {
            token: googleToken
          }
        })
      }

      const jwtUserModel: JWTUserModel = {
        id: authUser.userId,
        username: authUser.user.username
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
          user: UsersService.filterSafeUserInfo(authUser.user),
          accessToken
        },
        message: t('Login.Success')
      })
    } else {
      const user = await prisma.user.create({
        data: {
          username: `User-${generateRandomString(8)}`,
          password: await hash(SEED_SUPER_ADMIN_PASSWORD, 10),
          name: googleUserData.name,
          firstName: googleUserData.firstName,
          lastName: googleUserData.lastName,
          avatarUrl: googleUserData.avatarUrl,
          enabled: true,
          verified: true,
          auths: {
            create: {
              authType: AuthType.Google,
              token: googleToken,
              openId: googleUserData.id.toString(),
              data: googleUserResponse.data
            }
          }
        }
      })

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

      response.status(200).json({
        data: {
          user: UsersService.filterSafeUserInfo(user),
          accessToken
        },
        message: t('Login.Success')
      })
    }
  } catch (error) {
    console.log(error)
    response.status(401).json({
      message: t('Google.Authorize.Failed')
    })
  }
})

export default router
