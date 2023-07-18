import loginRouter from './login.controller'
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
  }
]

export default routes
