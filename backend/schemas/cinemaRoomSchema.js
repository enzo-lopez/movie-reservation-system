import mongoose from 'mongoose'

const seatSchema = new mongoose.Schema({
  row: String,
  numberSeat: Number,
  isAvaible: Boolean,
})

const cinemaRoomSchema = new mongoose.Schema({
  movie: {type: mongoose.Schema.Types.ObjectId, ref: 'movies', required: true},
  date: {type: Date, required: true},
  time: {type: String, required: true},
  seats: {type: [seatSchema], required: true}, // Lista de asientos
})

export const CinemaRoom = mongoose.model('cinemaRoom', cinemaRoomSchema)

export function generateSeats() {
  const rows = ['A', 'B', 'C', 'D', 'E']
  const seatsPerRow = 7
  const seats = []

  rows.forEach(row => {
    for (let numberSeat = 1; numberSeat <= seatsPerRow; numberSeat++) {
      seats.push({row, numberSeat, isAvaible: true})
    }
  })

  return seats
}
