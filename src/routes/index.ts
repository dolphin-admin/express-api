import loginRouter from './login.controller'
import settingsRouter from './settings.controller'
import signupRouter from './signup.controller'
import uploadRouter from './upload.controller'
import userRouter from './users.controller'

const routes = [
  {
    path: '/login',
    router: loginRouter
  },
  {
    path: '/signup',
    router: signupRouter
  },
  {
    path: '/users',
    router: userRouter,
    auth: true
  },
  {
    path: '/settings',
    router: settingsRouter,
    auth: true
  },
  {
    path: '/upload',
    router: uploadRouter,
    auth: true
  }
]

export default routes
