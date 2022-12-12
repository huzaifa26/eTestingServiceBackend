import express from 'express';
import dotenv from 'dotenv';
import router from './routes/routes.js';
import mysql from 'mysql2';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200
}

const app = express();
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions));


const createConnection = async () => {
  return new Promise((resolve, reject) => {
    resolve(mysql.createConnection({
      host: process.env.HOST,
      user: process.env.USER,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
    }))
    reject(null);
  })
}

export let pool = null
await createConnection().then(res => { console.log("Database Connected"); pool = res }).catch(err => { console.log(err) })

app.use('/api', router);

app.listen(5000, () => {
  console.log(`App started on Port ${process.env.PORT}`);
});