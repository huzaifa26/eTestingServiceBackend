import express from 'express';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import { pool } from '../index.js';
dotenv.config();


export const CreateCourse = async(req,res)=>{
    console.log(req.body);

    const { userId, imageUrl, courseName, description, startDate, endDate, format, createTime } = req.body;
    const createCourseQuery="INSERT INTO courses (userId,imageUrl,courseName,courseDescription,createTime,startTime,endTime,courseFormat) VALUES (?,?,?,?,?,?,?,?)";

    pool.query(createCourseQuery,[userId, imageUrl, courseName, description, createTime, startDate, endDate, format],(err,row,field)=>{
        console.log(err);
        if (err) {
            console.log(err);
            res.status(500).json({
              success: 0,
              message: 'Cannot Register Course',
              err:err
            });
          } else {
              console.log("Success");
              res.status(200).json({
              success: 1,
              message: 'Course Registered',
              id: row.insertId,
            });
          }
    })
}

export const getCourses= async(req,res)=>{
    const sqlQuery="select * from courses";
    pool.query(sqlQuery,(err,row,field)=>{
        res.status(200).json({data:row});
    })
}

export const getCourseNames= async(req,res)=>{
  const sqlQuery="select id,courseName from courses where userId=?";

  pool.query(sqlQuery,req.params.userId,(err,row,field)=>{
      res.status(200).json({data:row});
  })
}