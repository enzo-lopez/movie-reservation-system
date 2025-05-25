import {CinemaRoomModel} from '../models/cinemaRoomModel.js'

export class CinemaRoomController {
  constructor() {
    this.CinemaRoomModel = CinemaRoomModel
  }

  getCinemaRoom = async (req, res) => {
    const {date, time, movie} = req.query
    const cinemaRoom = await this.CinemaRoomModel.getCinemaRoom({
      date,
      time,
      movie,
    })
    if (cinemaRoom.error) {
      return res.status(401).json({error: cinemaRoom.error})
    }
    res.status(201).json({cinemaRoom: cinemaRoom})
  }

  getAll = async (req, res) => {
    const cinemaRooms = await this.CinemaRoomModel.getAll()
    if (cinemaRooms.error) {
      return res.status(401).json({error: cinemaRooms.error})
    }
    res.status(201).json(cinemaRooms)
  }

  getCinemaRoomByFilter = async (req, res) => {
    const {date, movie} = req.params
    const cinemaRoom = await this.CinemaRoomModel.getCinemaRoom({
      date,
      movie,
    })
    if (cinemaRoom.error) {
      return res.status(401).json({error: cinemaRoom.error})
    }
    res.status(201).json({cinemaRoom: cinemaRoom})
  }

  createOrUpdateCinemaRoom = async (req, res) => {
    const {date, time, movie, seats} = req.body
    const cinemaRoom = await this.CinemaRoomModel.createOrUpdateCinemaRoom({
      date,
      time,
      movie,
      seats,
    })
    if (cinemaRoom.error) {
      return res.status(401).json({error: cinemaRoom.error})
    }
    res.status(201).json({cinemaRoom: cinemaRoom})
  }

  updateCinemaRoom = async (req, res) => {
    const cinemaRoomId = req.params.id
    const cinemaRoom = await this.CinemaRoomModel.updateCinemaRoom({
      cinemaRoomId,
      updates: req.body,
    })
    if (cinemaRoom.error) {
      return res.status(404).json({error: cinemaRoom.error})
    }
    res.status(201).json({cinemaRoom: cinemaRoom})
  }

  deleteCinemaRoom = async (req, res) => {
    const cinemaRoomId = req.params.id
    const result = await this.CinemaRoomModel.delete({cinemaRoomId})
    if (result.error) {
      return res.status(404).json({error: result.error})
    }
    res.status(200).json({message: result.message})
  }
}
