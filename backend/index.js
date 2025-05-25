import 'dotenv/config'
import express from 'express'
import mongo from './config/mongo.js'
import {movieRouter} from './routes/movieRouter.js'
import {userRouter} from './routes/userRouter.js'
import {reservationRouter} from './routes/reservationRouter.js'
import {cinemaRoomRouter} from './routes/cinemaRoomRouter.js'
import cors from 'cors'

const app = express()
mongo.connectToMongo

app.use(express.json())

const PORT = process.env.PORT || process.env.PORT_BACKEND || 3001
app.use(cors({origin: `${process.env.NEXT_PUBLIC_FRONTEND_URL}`}))

app.use('/user', userRouter())
app.use('/movie', movieRouter())
app.use('/cinema-room', cinemaRoomRouter())
app.use('/reservation', reservationRouter())

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}/`)
})
