import jwt from 'jsonwebtoken'

export const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]

  if (!token) {
    return res.status(401).json({error: 'Token requerido'})
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({error: 'Token inválido'})
    }

    // Agrega los datos del usuario al request
    req.user = decoded
    next()
  })
}
