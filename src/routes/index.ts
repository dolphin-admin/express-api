import homeRouter from './home.controller'
import loginRouter from './login.controller'
import settingsRouter from './settings.controller'
import uploadRouter from './upload.controller'
import userRouter from './users.controller'

const routes = [
  {
    path: '/',
    router: homeRouter
  },
  {
    path: '/login',
    router: loginRouter
  },
  {
    path: '/users',
    router: userRouter
  },
  {
    path: '/settings',
    router: settingsRouter
  },
  {
    path: '/upload',
    router: uploadRouter
  }
]

export default routes
