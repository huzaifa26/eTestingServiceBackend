import express from 'express';
import dotenv from 'dotenv';
import { pool } from '../index.js';
import { genSaltSync, hashSync, compareSync } from 'bcrypt';
import Jwt from 'jsonwebtoken';
dotenv.config();

export const login = (req, res) => {
  const { email, password } = req.body;
  pool.query(
    'SELECT * FROM `users` where `email`=?',
    [email],
    (error, results) => {
      if (error) console.log('an error occur' + error);
      else if (results.length === 0) {
        res.status(401).json({ message: 'No account' });
      } else if (results[0].verified === '0') {
        console.log('not verified');
        return res.status(405).json({ user: 'Verify your email' });
      } else {
        const xyz = compareSync(password, results[0].password);
        if (xyz) {
          const token = Jwt.sign(
            {
              username: results[0].username,
              userId: results[0].id,
            },
            process.env.SECRETKEY,
            {
              expiresIn: '7d',
            },
            (err, token) => {
              if (err) {
                res.send(err);
              } else {
                res.status(200).send({
                  msg: 'Logged in!',
                  token: token,
                  user: results[0],
                });
              }
            }
          );
        } else {
          res.status(403).json({ user: 'Password is wrong' });
        }
      }
    }
  );
};

export const SignUp = (req, res) => {
  const { fullName, email } = req.body;
  const salt = genSaltSync(10);
  const password = hashSync(req.body.password, salt);
  pool.query(
    'INSERT INTO users (name,email,password) VALUES (?,?,?)',
    [fullName, email, password],
    (err, results) => {
      if (err) {
        res.status(500).json({
          success: 0,
          message: 'User with this email already exists',
        });
      } else {
        res.status(200).json({
          success: 1,
          data: results,
          id: results.insertId,
          email: email,
        });
      }
    }
  );
};

export const EmailVerify = (req, res) => {
  const { id } = req.body;

  pool.query(
    'UPDATE users set verified = true where id=?',
    id,
    (err, results) => {
      if (err !== null) {
        console.log(err);
        res.status(400).send(err);
        return;
      }
      res.status(200).json('Success');
    }
  );
};
// export const ForgotPassword = (req, res) => {
//   const { id } = req.body;
//   const salt = genSaltSync(10);
//   const password = hashSync(req.body.password, salt);

//   pool.query(
//     'UPDATE users SET password=? where id=?',
//     [password, id],
//     (err, results) => {
//       if (err !== null) {
//         console.log(err);
//         res.status(400).send(err);
//         return;
//       }
//       res.status(200).json('Success');
//     }
//   );
// };
