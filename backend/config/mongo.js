import mongoose from 'mongoose'
import 'dotenv/config'

async function connectToMongo() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('Connected to mongo successfully')
  } catch (error) {
    console.log('Connected failed: ' + error.message)
  }
}

export default connectToMongo()

