import mongoose from 'mongoose'

const seatSchema = new mongoose.Schema({
  row: {type: String, required: true},
  numberSeat: {type: Number, required: true},
  isAvaible: {type: Boolean, default: true},
})

const userReservationSchema = new mongoose.Schema({
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true},
  movie: {type: mongoose.Schema.Types.ObjectId, ref: 'movies', required: true},
  date: {type: Date, required: true},
  time: {type: String, required: true},
  seats: {type: [seatSchema]},
})

export const UserReservation = mongoose.model(
  'userReservation',
  userReservationSchema
)
