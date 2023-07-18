class AuthService {
  POST_GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token'

  GET_GITHUB_USER_URL = 'https://api.github.com/user'

  POST_GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'

  GET_GOOGLE_USER_URL = 'https://www.googleapis.com/oauth2/v2/userinfo'
}

export default new AuthService()
