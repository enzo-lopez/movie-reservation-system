import {UserModel} from '../models/userModel.js'
import bcrypt from 'bcrypt'
import 'dotenv/config'
import jwt from 'jsonwebtoken'

export class UserController {
  constructor() {
    this.UserModel = UserModel
  }

  register = async (req, res) => {
    const {username, email, password} = req.body

    try {
      const salt = await bcrypt.genSalt(10)
      const hashed = await bcrypt.hash(password, salt)

      const user = await this.UserModel.register({
        username,
        email,
        role: 'USER',
        password: hashed,
      })
      res.status(201).json({
        message: 'User registered successfully',
        usuario: user,
      })
    } catch (error) {
      res.status(500).json({error: 'Error trying to register the user'})
    }
  }

  login = async (req, res) => {
    const {email, password} = req.body
    try {
      const user = await this.UserModel.getUserByEmail({email})
      if (!user) {
        return res.status(404).json({error: 'Error user or password incorrect'})
      }

      const isPasswordCorrect = await bcrypt.compare(password, user.password)
      if (!isPasswordCorrect) {
        return res.status(401).json({error: 'Error user or password incorrect'})
      }

      // Generar token
      const token = jwt.sign(
        {id: user._id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN}
      )

      const userResponse = {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        token: token,
      }

      res.status(200).json(userResponse)
    } catch (error) {
      res.status(500).json({error: 'Error trying to login'})
    }
  }

  getAllUsers = async (req, res) => {
    try {
      const users = await this.UserModel.getAllUsers()
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({error: 'Error while fetching the users'})
    }
  }

  getUserById = async (req, res) => {
    try {
      const user = await this.UserModel.getUserById({id: req.params.id})
      if (!user) {
        return res.status(404).json({error: 'User not found'})
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({error: 'Error while fetching the user'})
    }
  }

  updateUser = async (req, res) => {
    try {
      const user = await this.UserModel.updateUser({
        id: req.params.id,
        data: req.body,
      })
      if (!user) {
        return res.status(404).json({error: 'User not found'})
      }
      res.status(200).json(user)
    } catch (error) {
      res.status(500).json({error: 'Error updating the user'})
    }
  }

  deleteUser = async (req, res) => {
    try {
      const user = await this.UserModel.deleteUser({id: req.params.id})
      if (!user) {
        return res.status(404).json({error: 'User not found'})
      }
      res.status(200).json({message: 'User deleted successfully'})
    } catch (error) {
      res.status(500).json({error: 'Error while deleting the user'})
    }
  }
}
