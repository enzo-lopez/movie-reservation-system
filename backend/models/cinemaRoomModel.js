import {CinemaRoom, generateSeats} from '../schemas/cinemaRoomSchema.js'

export class CinemaRoomModel {
  static async getCinemaRoom({date, time, movie}) {
    try {
      let cinemaRoom = await CinemaRoom.findOne({date, time, movie})
      if (!cinemaRoom) {
        // Se genera un cine temporal, con asientos vacios
        cinemaRoom = {
          movie,
          date,
          time,
          seats: generateSeats(),
        }
        return cinemaRoom
      }

      return cinemaRoom
    } catch (error) {
      return {error: 'Error getting the cinema room: ' + error.message}
    }
  }

  static async getAll() {
    try {
      const cinemaRooms = await CinemaRoom.find().populate({
        path: 'movie',
        select: 'title'
      })
      return cinemaRooms
    } catch (error) {
      return {error: 'Error getting all cinema rooms'}
    }
  }

  static async getCinemaRoomByFilter({date, movie}) {
    try {
      const cinemaRoom = await CinemaRoom.find({date, movie})
      return cinemaRoom.populate('movie')
    } catch (error) {
      return {error: 'Error getting the cinema room by filter'}
    }
  }

  static async createOrUpdateCinemaRoom({date, time, movie, seats}) {
    try {
      // Buscar la sala de cine con date, time y movie
      let cinemaRoom = await CinemaRoom.findOne({date, time, movie})

      if (!cinemaRoom) {
        // Si no existe, crear una nueva sala de cine utilizando generateSeats
        cinemaRoom = new CinemaRoom({
          date,
          time,
          movie,
          seats: generateSeats(),
        })
      }

      // Actualizar los asientos proporcionados
      if (seats) {
        seats.forEach(seatToUpdate => {
          const seat = cinemaRoom.seats.find(
            s =>
              s.row === seatToUpdate.row &&
              s.numberSeat === seatToUpdate.numberSeat
          )
          if (seat) {
            seat.isAvaible = seatToUpdate.isAvaible
          }
        })
      }

      // Guardar la sala de cine
      await cinemaRoom.save()

      return cinemaRoom.populate('movie')
    } catch (error) {
      console.error(error)
      return {error: 'Error creating or updating the cinema room'}
    }
  }

  static async updateCinemaRoom({cinemaRoomId, updates}) {
    try {
      const cinemaRoom = await CinemaRoom.findById(cinemaRoomId)
      if (!cinemaRoom) {
        return {error: 'Cinema Room not found'}
      }

      // Convertir la fecha si está presente en las actualizaciones
      if (updates.date) {
        updates.date = new Date(updates.date)
        console.log(updates.date)
      }

      Object.assign(cinemaRoom, updates)
      await cinemaRoom.save()
      return cinemaRoom.populate('movie')
    } catch (error) {
      console.error(error)
      return {error: 'An error occurred while updating the cinema room'}
    }
  }

  static async delete({CinemaRoomId}) {
    try {
      await CinemaRoom.findOneAndDelete({CinemaRoomId})
      return {message: 'CinemaRoom deleted successfuly'}
    } catch (error) {
      return {
        error: 'An error ocurred while delete the cinemaRoom, incorrect ID ?',
      }
    }
  }
}
