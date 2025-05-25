import {Router} from 'express'
import {MovieController} from '../controller/movieController.js'
import {authenticateToken} from '../middlewares/authenticateToken.js'
import {isAdmin} from '../middlewares/isAdmin.js'

export const movieRouter = () => {
  const router = Router()

  const movieController = new MovieController()

  router.get('/', movieController.getAll) // Todas las peliculas
  router.get('/:id', movieController.getById)

  // Admins
  router.post('/', authenticateToken, isAdmin, movieController.create)
  router.put('/:id', authenticateToken, isAdmin, movieController.update)
  router.delete('/:id', authenticateToken, isAdmin, movieController.delete)

  return router
}
