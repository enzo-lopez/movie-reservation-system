import {Router} from 'express'
import {UserController} from '../controller/userController.js'
import {authenticateToken} from '../middlewares/authenticateToken.js'
import {isAdmin} from '../middlewares/isAdmin.js'

export const userRouter = () => {
  const router = Router()

  const userController = new UserController()

  router.post('/login', userController.login)

  router.post('/register', userController.register)


  // Admin
  router.get('/', authenticateToken, isAdmin, userController.getAllUsers)

  router.get('/:id', authenticateToken, isAdmin, userController.getUserById)

  router.put('/:id', authenticateToken, isAdmin, userController.updateUser)

  router.delete('/:id', authenticateToken, userController.deleteUser)

  return router
}
