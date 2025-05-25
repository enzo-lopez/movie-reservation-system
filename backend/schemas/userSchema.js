import mongoose from 'mongoose'

const userSchema = mongoose.Schema({
  username: {type: String, minLenght: 3, unique: true, required: true},
  email: {
    type: String,
    unique: true,
    required: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  },
  role: {type: String, default: 'USER'},
  password: {type: String, required: true, minLength: 3},
  reservation: [{type: mongoose.Schema.Types.ObjectId, ref: 'userReservation'}],
})

export const User = mongoose.model('users', userSchema)
