import {User} from './schemas/userSchema.js'

const newUser = new User({
  username: 'Rocko',
  email: 'rocko@example.com',
  password: 'El perro',
})

await newUser.save()
console.log('Usuario creado: ', newUser)
