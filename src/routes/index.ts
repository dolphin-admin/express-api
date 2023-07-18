import loginRouter from './login.controller'
import menuRouter from './menu.controller'
import signupRouter from './signup.controller'
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
    path: '/menu',
    router: menuRouter,
    auth: true
  }
]

export default routes
