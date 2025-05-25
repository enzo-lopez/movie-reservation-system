export const isAdmin = (req, res, next) => {
  if (req.user.role != 'ADMIN') {
    return res.status(401).json({error: 'Acceso denegado'})
  }
  next()
}
