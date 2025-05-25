import z from 'zod'

const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string',
    required_error: 'Movie title is required',
  }),
  description: z.string(),
  poster: z.string({
    required_error: 'Poster must be a valid URL',
  }),
  duration: z.string(),
  trailer: z.string({
    required_error: 'Trailer must be a valid URL',
  }),
  genre: z
    .enum(
      [
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
      {
        invalid_type_error: 'Genre must be a valid array of enum genre',
        required_error: 'Genre is required',
      }
    )
    .array(),
})

export function validateMovie(object) {
  return movieSchema.safeParse(object)
}

export function validateParcialMovie(object){
  return movieSchema.partial().safeParse(object)
}
