import express from 'express';
import dotenv from 'dotenv';
import router from './routes/routes.js';
import mysql from 'mysql2';
import cors from 'cors';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
dotenv.config();
app.use(express.json());
app.use(cors());

const getPoolConnection = async () => {
  return mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
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
