import {Movies} from '../schemas/movieSchema.js'

export class MovieModel {
  static async getAll({genre}) {
    try {
      if (genre) {
        const genrePascalCase = `^${genre}$`
        const filterMovies = await Movies.find({
          genre: {$regex: genrePascalCase, $options: 'i'},
        })
        return filterMovies.length
          ? filterMovies
          : {
              Error:
                'An error occurred while fetching the movies, title not found ?',
            }
      }
      // Si no hay genero devuelve todas
      return await Movies.find()
    } catch (error) {
      return {
        error: 'An error occurred while fetching the movies',
      }
    }
  }

  static async getById({id}) {
    try {
      const movie = await Movies.findOne({_id: id})
      return movie
    } catch (error) {
      return {
        error: 'An error occurred while fetching the movies, incorrect ID ?',
      }
    }
  }

  static async create({input}) {
    const newMovie = new Movies({...input})
    await newMovie.save()

    return newMovie
  }

  static async update({id, input}) {
    try {
      const movie = await this.getById({id})
      Object.assign(movie, input)

      return await movie.save()
    } catch (error) {
      return {
        error: 'An error ocurred while updating the movie, incorrect ID ?',
      }
    }
  }

  static async delete({id}) {
    try {
      const movie = await this.getById({id})
      await movie.deleteOne()
      return {
        message: 'Movie deleted successfully',
      }
    } catch (error) {
      return {
        error: 'An error ocurred while delete the movie, incorrect ID ?',
      }
    }
  }
}
