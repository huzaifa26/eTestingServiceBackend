import express from 'express';
import dotenv from 'dotenv';
import router from './routes/routes.js';
import mysql from 'mysql2';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const corsOptions ={
  origin:'http://localhost:3000', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}


const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));

const getPoolConnection = async () => {
  return mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
  });
};

export const pool = await getPoolConnection()
  .then((pool) => {
    console.log('Database Connected');
    return pool;
  })
  .catch((err) => {
    console.log(err);
  });

app.use('/api', router);

app.listen(5000, () => {
  console.log(`App started on Port ${process.env.PORT}`);
});
