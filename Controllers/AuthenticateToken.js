import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  Jwt.verify(token, process.env.SECRETKEY, (err, user) => {

    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}