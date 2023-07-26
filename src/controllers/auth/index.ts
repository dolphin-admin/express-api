import { hash } from '@node-rs/bcrypt'
import axios from 'axios'
import { Request } from 'express'

import { JWTManager } from '@/core'
import { Controller, Post } from '@/decorators'
import type { UserLoginInputModel, UserSignupInputModel } from '@/models'
import { UserLoginResponse, UserSignupResponse } from '@/models'
import { pgClient, SEED_SUPER_ADMIN_PASSWORD } from '@/prisma'
import { AuthService, UsersService } from '@/services'
import { AuthType, generateRandomString, GlobalAuthConfig, passwordEquals, passwordHash } from '@/shared'
import type { JWTModel } from '@/types'

@Controller('/auth')
class AuthController {
  /**
   * 注册
   */
  @Post('/signup')
  async signup(request: Request, response: UserSignupResponse) {
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
      password: await passwordHash(password)
    })

    const jwtModel: JWTModel = {
      id: user.id,
      username: user.username
    }

    const accessToken = JWTManager.generateAccessToken(jwtModel)
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
  }

  /**
   * 登录
   */
  @Post('/login')
  async login(request: Request, response: UserLoginResponse) {
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

    const jwtModel: JWTModel = {
      id: user.id,
      username: user.username
    }
    const accessToken = JWTManager.generateAccessToken(jwtModel)
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

  /**
   * GitHub OAuth2.0 登录
   */
  @Post('/login/github')
  async loginWithGitHub(request: Request, response: UserLoginResponse) {
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
          `${AuthService.POST_GITHUB_TOKEN_URL}?client_id=${GITHUB_CLIENT_ID}&` +
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
        url: AuthService.GET_GITHUB_USER_URL,
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

      const authUser = await pgClient.auth.findFirst({
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
          await pgClient.auth.update({
            where: {
              id: authUser.id
            },
            data: {
              token: githubToken
            }
          })
        }

        const jwtModel: JWTModel = {
          id: authUser.userId,
          username: authUser.user.username
        }

        const accessToken = JWTManager.generateAccessToken(jwtModel)
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
        const user = await pgClient.user.create({
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

        const jwtModel: JWTModel = {
          id: user.id,
          username: user.username
        }

        const accessToken = JWTManager.generateAccessToken(jwtModel)
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
  }

  /**
   * Google OAuth2.0 登录
   */
  @Post('/login/google')
  async loginWithGoogle(request: Request, response: UserLoginResponse) {
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
        url: AuthService.POST_GOOGLE_TOKEN_URL,
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
        url: AuthService.GET_GOOGLE_USER_URL,
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

      const authUser = await pgClient.auth.findFirst({
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
          await pgClient.auth.update({
            where: {
              id: authUser.id
            },
            data: {
              token: googleToken
            }
          })
        }

        const jwtModel: JWTModel = {
          id: authUser.userId,
          username: authUser.user.username
        }

        const accessToken = JWTManager.generateAccessToken(jwtModel)
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
        const user = await pgClient.user.create({
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

        const jwtModel: JWTModel = {
          id: user.id,
          username: user.username
        }

        const accessToken = JWTManager.generateAccessToken(jwtModel)
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
  }
}

export default new AuthController()
