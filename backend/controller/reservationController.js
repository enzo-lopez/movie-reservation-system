import {ReservationModel} from '../models/reservationModel.js'
import {User} from '../schemas/userSchema.js'
import {CinemaRoomModel} from '../models/cinemaRoomModel.js'
// user: "6740f0f8ef89434c7e3031eb",
// movie: "673a45fcc477dbf8de2e04cd",
/*
const reservation = {
  user: '6740f0f8ef89434c7e3031eb',
  movie: '673a45fcc477dbf8de2e04cd',
  date: new Date('2024-11-22'),
  time: '20:00',
  choosenSeats: [
    {row: 'A', numberSeat: 1, isAvaible: false},
    {row: 'B', numberSeat: 2, isAvaible: false},
    {row: 'C', numberSeat: 3, isAvaible: false},
  ],
}
*/

export class ReservationController {
  constructor() {
    this.ReservationModel = ReservationModel
  }

  createUserReservation = async (req, res) => {
    const {user, movie, date, time, seats} = req.body

    // Verificar si la sala de cine existe
    // Si no existe, se crea una nueva sala Cinema Room
    // Ocupando los asientos proporcionados
    const cinemaRoom = await CinemaRoomModel.createOrUpdateCinemaRoom({
      date,
      time,
      movie,
      seats,
    })

    if (cinemaRoom.error) {
      return res.status(400).json({error: cinemaRoom.error})
    }
    const reservation = {
      user,
      movie,
      date,
      time,
      seats,
    }
    const newUserReservation =
      await this.ReservationModel.createUserReservation({reservation})

    if (newUserReservation.error) {
      return res.status(500).json(newUserReservation.error)
    }

    // Si el guardado de la reserva fue exitoso
    // Agregamos la reserva a la lista de reservas del usuario
    const userToUpdate = await User.findById(reservation.user)
    userToUpdate.reservation.push(newUserReservation._id)

    await userToUpdate.save()

    const newUserReservationPopulated =
      await newUserReservation.populate('movie')

    res.status(201).json({
      message: 'Reservation created successfully',
      movieName: newUserReservationPopulated.movie.title,
      date: newUserReservationPopulated.date,
      time: newUserReservationPopulated.time,
      seats: newUserReservationPopulated.seats,
    })
  }

  getUserReservations = async (req, res) => {
    // El id del usuario se obtiene del token
    const userId = req.user.id

    if (!userId) {
      return res.status(400).json({error: 'User session not found'})
    }

    const userReservations = await this.ReservationModel.getUserReservations({
      userId,
    })
    return res.status(201).json({user: userId, reservations: userReservations})
  }

  getUserReservationById = async (req, res) => {
    const userId = req.params.id
    const userReservations = await this.ReservationModel.getUserReservations({
      userId,
    })
    return res.status(201).json({user: userId, reservations: userReservations})
  }

  getAllReservations = async (req, res) => {
    const allRervations = await this.ReservationModel.getAllReservations()
    return res.status(201).json(allRervations)
  }

  delete = async (req, res) => {
    const {id} = req.params
    const result = await this.ReservationModel.delete({id})
    if (result.error) {
      return res.status(400).json({error: result.error})
    }
    return res.json({message: result.message})
  }
}
