import {UserReservation} from '../schemas/reservationSchema.js'



export class ReservationModel {
  static async createUserReservation({reservation}) {
    try {
      const newUserReservation = new UserReservation({...reservation})
      await newUserReservation.save()

      return newUserReservation
    } catch (error) {
      return {error: 'Error while creating the reservation: '}
    }
  }

  static async getUserReservations({userId}) {
    try {
      const reservations = await UserReservation.find({user: userId})
      .populate('user')
      .populate('movie')

      const reservationsWithDetails = reservations.map(reservation => ({
        reservationId: reservation._id,
        username: reservation.user && reservation.user.username ? reservation.user.username : 'Unknown',
        movieName: reservation.movie.title,
        date: reservation.date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
        time: reservation.time,
        seats: reservation.seats,
      }))

      return reservationsWithDetails
    } catch (error) {
      return {error: 'Error while fetching reservations: ' + error.message}
    }
  }

  static async getAllReservations() {
    try {
      const reservations = await UserReservation.find()
      .populate('user')
      .populate('movie')

      const reservationsWithDetails = reservations.map(reservation => ({
        _id: reservation._id,
        username: reservation.user && reservation.user.username ? reservation.user.username : 'Unknown',
        movieName: reservation.movie.title,
        date: reservation.date,
        time: reservation.time,
        seats: reservation.seats,
      }))

      return reservationsWithDetails
    } catch (error) {
      return {error: 'Error while fetching reservations: ' + error.message}
    }
  }

  static async getReservationById({id}) {
    return await UserReservation.findById(id)
  }

  static async delete({id}) {
    try {
      const reservation = await UserReservation.findById(id)
      await reservation.deleteOne()
      return {
        message: 'Reservation deleted successfully',
      }
    } catch (error) {
      return {
        error: 'An error ocurred while delete the reservation',
      }
    }
  }
}
