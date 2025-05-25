import {MovieModel} from '../models/movieModel.js'
import {validateMovie, validateParcialMovie} from '../schemas/movieSchemaZod.js'

export class MovieController {
  constructor() {
    this.MovieModel = MovieModel
  }

  getAll = async (req, res) => {
    const {genre} = req.query
    const movies = await this.MovieModel.getAll({genre})
    if (movies.error) {
      return res.status(404).json({message: movies.error})
    }
    res.json(movies)
  }

  getById = async (req, res) => {
    const {id} = req.params
    const movie = await this.MovieModel.getById({id})
    if (movie.error) {
      return res.status(400).json({message: movie.error})
    }
    return res.json(movie)
  }

  create = async (req, res) => {
    req.body.trailer = ''
    const result = validateMovie(req.body)

    if (result.error) {
      return res.status(400).json({message: JSON.parse(result.error.message)})
    }

    const newMovie = await this.MovieModel.create({input: result.data})
    res.status(201).json(newMovie)
  }

  update = async (req, res) => {
    const result = validateParcialMovie(req.body)
    if (result.error) {
      res.status(400).json({error: JSON.parse(result.error.message)})
    }
    const {id} = req.params
    const updateMovie = await this.MovieModel.update({id, input: result.data})
    if (updateMovie.error) {
      return res.status(400).json({error: updateMovie.error})
    }
    return res.json(updateMovie)
  }

  delete = async (req, res) => {
    const {id} = req.params
    const result = await this.MovieModel.delete({id})

    if (result.error) {
      return res.status(400).json({error: result.error})
    }
    res.json({message: result.message})
  }
}
