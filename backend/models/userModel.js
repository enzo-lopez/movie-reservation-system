import {User} from '../schemas/userSchema.js'

export class UserModel {
  static async register({username, email, role, password}) {
    const newUser = new User({username, email, role, password})
    await newUser.save()
    return newUser
  }

  static async getUserByEmail({email}) {
    return User.findOne({email})
  }

  static async getAllUsers() {
    let users = await User.find()
    users = users.map(user => {
      return {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    })
    return users
  }

  static async getUserById({id}) {
    return await User.findOne({_id:id}).populate('reservation')
  }

  static async updateUser({id, data}) {
    return await User.findByIdAndUpdate(id, data, {new: true})
  }

  static async deleteUser({id}) {
    return User.findByIdAndDelete(id)
  }
}
