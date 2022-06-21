import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function authenticateToken(req, res, next) {
  const authcookie = req.cookies.token;
  // const authHeader = req.headers['authorization']
  console.log(authcookie)
  // const token = authHeader && authHeader.split(' ')[1]
  
  if (authcookie == null) return res.sendStatus(401);

  Jwt.verify(authcookie, process.env.SECRETKEY, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next();
  })
}