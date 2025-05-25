import mongoose from 'mongoose'

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true, minLength: 3 },
  description: { type: String, required: true },
  poster: { type: String, required: true },
  duration: { type: String, required: true },
  trailer: { type: String, required: false },
  genre: {
    type: [String],
    required: true,
    enum: [
      'Action',
      'Adventure',
      'Crime',
      'Comedy',
      'Drama',
      'Fantasy',
      'Horror',
      'Romance',
      'Thriller',
      'Sci-Fi',
    ],
  },
})

export const Movies = mongoose.model('movies', movieSchema)
