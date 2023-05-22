// import express from 'express';
// import dotenv from 'dotenv';
import dotenv from "../dotenv"
import router from '../routes/routes.js';
// import mysql from 'mysql2';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true,
//   optionSuccessStatus: 200
// }

// const app = express();
// dotenv.config();
// app.use(express.json());
// app.use(cookieParser());
// app.use(cors(corsOptions));

// const createConnection = async () => {
//   return new Promise((resolve, reject) => {
//     resolve(mysql.createConnection({
//       host: process.env.HOST,
//       user: process.env.USER,
//       password: process.env.PASSWORD,
//       database: process.env.DATABASE,
//     }))
//     reject(null);
//   })
// }

// export let pool = null
// await createConnection()
//   .then(res => {
//     console.log("Database Connected");
//     pool = res
//   })
//   .catch(err => {
//     console.log(err)
//   })

// app.use('/api', router);

// app.get("/",(req,res)=>{
//   res.send("Working...");
// })

// app.listen(5000, () => {
//   console.log(`App started on Port ${process.env.PORT}`);
// });


// import dotenv from 'dotenv';
// import mysql from 'mysql2/promise';
// import cors from 'cors';
// import cookieParser from 'cookie-parser';

// dotenv.config();

// const corsOptions = {
//   origin: 'http://localhost:3000',
//   credentials: true,
//   optionSuccessStatus: 200
// };

// const createConnection = async () => {
//   try {
//     const connection = await mysql.createConnection({
//       host: process.env.HOST,
//       user: process.env.USER,
//       password: process.env.PASSWORD,
//       database: process.env.DATABASE,
//     });
//     console.log("Database Connected");
//     return connection;
//   } catch (err) {
//     console.error(err);
//     return null;
//   }
// };

// const handler = async (event, context) => {
//   const app = express();
//   app.use(express.json());
//   app.use(cookieParser());
//   app.use(cors(corsOptions));

//   let pool = null;
//   pool = await createConnection();

//   if (!pool) {
//     return {
//       statusCode: 500,
//       body: JSON.stringify({ message: 'Failed to connect to the database' })
//     };
//   }

//   app.use('/api', router);

//   app.get('/',(req,res)=> res.send("Working..."))

//   return new Promise((resolve, reject) => {
//     app.listen(5000, (error) => {
//       if (error) {
//         reject(error);
//       } else {
//         resolve({
//           statusCode: 200,
//           body: JSON.stringify({ message: 'Netlify function is running' })
//         });
//       }
//     });
//   });
// };

// export { handler };

// const express = require('express');
// const serverless = require('serverless-http');
// const app = express();
// const router = express.Router();

// let records = [];

// //Get all students
// router.get('/', (req, res) => {
//   res.send('App is running..');
// });

// //Create new record
// router.post('/add', (req, res) => {
//   res.send('New record added.');
// });

// //delete existing record
// router.delete('/', (req, res) => {
//   res.send('Deleted existing record');
// });

// //updating existing record
// router.put('/', (req, res) => {
//   res.send('Updating existing record');
// });

// //showing demo records
// router.get('/demo', (req, res) => {
//   res.json([
//     {
//       id: '001',
//       name: 'Smith',
//       email: 'smith@gmail.com',
//     },
//     {
//       id: '002',
//       name: 'Sam',
//       email: 'sam@gmail.com',
//     },
//     {
//       id: '003',
//       name: 'lily',
//       email: 'lily@gmail.com',
//     },
//   ]);
// });

// app.use('/.netlify/functions/api', router);
// module.exports.handler = serverless(app);


import express from 'express';
import serverless from 'serverless-http';

const app = express();
const router = express.Router({ mergeParams: true });

let records = [];

// Get all students
router.get('/', (req, res) => {
  res.send('App is running..');
});

// Create new record
router.post('/add', (req, res) => {
  res.send('New record added.');
});

// Delete existing record
router.delete('/', (req, res) => {
  res.send('Deleted existing record');
});

// Update existing record
router.put('/', (req, res) => {
  res.send('Updating existing record');
});

// Show demo records
router.get('/demo', (req, res) => {
  res.json([
    {
      id: '001',
      name: 'Smith',
      email: 'smith@gmail.com',
    },
    {
      id: '002',
      name: 'Sam',
      email: 'sam@gmail.com',
    },
    {
      id: '003',
      name: 'lily',
      email: 'lily@gmail.com',
    },
  ]);
});

app.use('/.netlify/functions/api', router);

export const handler = serverless(app);