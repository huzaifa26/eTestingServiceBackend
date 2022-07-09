import express from 'express';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import { pool } from '../index.js';
dotenv.config();


export const CreateCourse = async(req,res)=>{
    const { userId, imageUrl, courseName, description , createTime } = req.body;
    const createCourseQuery="INSERT INTO courses (userId,imageUrl,courseName,courseDescription,createTime) VALUES (?,?,?,?,?)";

    pool.query(createCourseQuery,[userId, imageUrl, courseName, description, createTime],(err,row,field)=>{
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
    const {userId}=req.params;
    const sqlQuery="select * from courses where userId=?";
    pool.query(sqlQuery,[userId],(err,row,field)=>{
        res.status(200).json({data:row});
    })
}
export const getJoinedCourses= async(req,res)=>{
    const {userId}=req.params;
    // console.log("here" +userId)
    pool.query("SELECT courses.id,courses.courseDescription,courses.courseName,courses.imageUrl FROM courses INNER JOIN enrolled ON courses.id = enrolled.courseId WHERE enrolled.userId=?",[userId],(err,row,field)=>{
      if(row.length>0)
      {
        console.log(row)
        res.status(200).json({data:row})
      }
      else{
        console.log(row)
      }
    })
}

export const getCourseNames= async(req,res)=>{
  const sqlQuery="select id,courseName from courses where userId=?";
  pool.query(sqlQuery,req.params.userId,(err,row,field)=>{
      res.status(200).json({data:row});
  })
}


export const getCourseCategories= async(req,res)=>{
  const sqlQuery="select id,courseId,categoryName from poolcategory where courseId=?";
  pool.query(sqlQuery,req.params.courseId,(err,row,field)=>{
      res.status(200).json({data:row});
  })
}


export const joinCourse= async(req,res)=>{
  const{userId , joiningkey,joinTime} = req.body
  pool.query("Select * from courses where id=?",joiningkey,(err,row,field)=>
  {
    if (err)
    {console.log(err)}
    if(row.length === 0)
    {res.status(400).json({message:'Wrong Key'})}
    if(row.length>0)
    {pool.query("Insert into enrolled (courseId,userId,joinedTime) VALUES (?,?,?)" ,[joiningkey,userId,joinTime], (err,row,field) =>
    {
      if (err)
      {
        if(err.code === 'ER_DUP_ENTRY')
        {res.status(401).json({message:'Duplicate'})}
        else
        console.log(err)}
      if(row)
      {
        if(row.affectedRows === 1)
        {res.status(200).json({message:'success'})}
        else
        {console.log(row)}
      }
    })}


  })
}