import {Router} from 'express'
import {ReservationController} from '../controller/reservationController.js'
import {authenticateToken} from '../middlewares/authenticateToken.js'
import {isAdmin} from '../middlewares/isAdmin.js'

export const reservationRouter = () => {
  const router = Router()

  const reservationController = new ReservationController()

  router.post(
    '/',
    authenticateToken,
    reservationController.createUserReservation
  )
  // Devuelve las reservas del usuario logueado
  router.get('/', authenticateToken, reservationController.getUserReservations)

  // Admin

  router.get(
    '/all',
    authenticateToken,
    isAdmin,
    reservationController.getAllReservations
  )

  router.get(
    '/:id',
    authenticateToken,
    isAdmin,
    reservationController.getUserReservationById
  )
  
  router.delete(
    '/:id',
    authenticateToken,
    isAdmin,
    reservationController.delete
  )

  return router
}
