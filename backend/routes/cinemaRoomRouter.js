import {Router} from 'express'
import {authenticateToken} from '../middlewares/authenticateToken.js'
import {isAdmin} from '../middlewares/isAdmin.js'
import {CinemaRoomController} from '../controller/cinemaRoomController.js'

export const cinemaRoomRouter = () => {
  const router = Router()

  const cinemaRoomController = new CinemaRoomController()

  /* Busca una sala cinemaRoom:
    Si existe se devuelve la sala cinemaRoom
    Si no existe se devuelve una sala temporal con asientos vacios*/
  router.get('/', authenticateToken, cinemaRoomController.getCinemaRoom)

  // Admins

  router.get('/:all', authenticateToken, isAdmin, cinemaRoomController.getAll)

  router.get(
    '/:date/:movie',
    authenticateToken,
    isAdmin,
    cinemaRoomController.getCinemaRoomByFilter
  )

  // Crea o actualiza una sala cinemaRoom con los datos movie, date, time y/o seats
  // Existen 3 casos posibles:
  // 1 - Si se recibe una sala con asientos ocupados, se creara la sala con esos asientos ocupados
  // 2 - Si se recibe una sala sin asientos ocupados, se creara la sala con asientos vacios
  // 3 - Si la sala ya existe, solo se actualizaran los asientos proporcionados
  // La funcionalidad de este end-point tambien se encuentra disponible en el end-point de reservas
  // De esta forma las salas se crean dinamicamente segun sea necesario
  router.post(
    '/',
    authenticateToken,
    isAdmin,
    cinemaRoomController.createOrUpdateCinemaRoom
  )

  router.patch(
    '/:id',
    authenticateToken,
    isAdmin,
    cinemaRoomController.updateCinemaRoom
  )
  router.delete(
    '/:id',
    authenticateToken,
    isAdmin,
    cinemaRoomController.deleteCinemaRoom
  )
  return router
}
