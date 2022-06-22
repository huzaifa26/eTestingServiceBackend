import Jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
export const tokenList = {}

export function authenticateToken(req, res, next) {
  const authcookie = req.cookies.token;

  // const { authorization } = req.headers;
  // let authcookie1=undefined;
  // if(authorization !== undefined){
  //   authcookie1 = authorization.split(' ')[1];
  // }

  let realCookie;

  // if (authcookie === undefined){
  //   realCookie=authcookie1
  // } else {
    realCookie=authcookie;
  // }

  if (realCookie == null ) return res.sendStatus(401);

  Jwt.verify(realCookie, process.env.SECRETKEY, (err, user) => {
    if (err) {
      console.log(err);
      return res.sendStatus(403)
    }
    req.user = user
    next();
  })
}

export const refreshToken=(req,res,next)=>{
  const authcookie = req.cookies.token;
  const refreshToken = req.cookies.reFreshToken;

  if((refreshToken) && (refreshToken in tokenList)) {
    let decoded = Jwt.verify(refreshToken, process.env.SECRETKEY);

    const token1 = Jwt.sign({
      username: decoded.username,
      userId: decoded.userId,
    },process.env.SECRETKEY,{expiresIn: '1d'});

      const user = {
          "username": decoded.username,
          "userId": decoded.userId
      }
      const token = Jwt.sign(user, process.env.SECRETKEY, { expiresIn: "10s"})
      tokenList[refreshToken] = token;
      res.cookie('token',token,{maxAge:100000000000});
      res.status(200).json(token); 
  } else {
      res.status(404).send('Invalid request')
  }
}