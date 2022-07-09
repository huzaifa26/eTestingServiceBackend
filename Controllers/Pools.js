import express from 'express';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import { pool } from '../index.js';
dotenv.config();

export const createPoolCategory = async(req,res)=>{
    console.log(req.body);

    const {courseId,userId,categoryName}=req.body;

    const createPoolQuery="INSERT INTO poolCategory (courseId,userId,categoryName) VALUES (?,?,?)";

    pool.query(createPoolQuery,[courseId,userId,categoryName],(err,row,field)=>{
        console.log(err);
        if (err) {
            console.log(err);
            res.status(500).json({
              success: 0,
              message: 'Cannot Register Pool Category',
              err:err
            });
          } else {
              console.log("Success");
              res.status(200).json({
              success: 1,
              message: 'Pool Category Registered',
            });
          }
    })
}


export const getPoolCategory = async(req,res)=>{
    console.log(req.params);

    const {courseId,userId}=req.params;

    const createPoolQuery="SELECT * from poolCategory where courseId=? and userId=?";

    pool.query(createPoolQuery,[courseId,userId],(err,row,field)=>{
        console.log(row)
        res.status(200).json({data:row});
    })
}

export const addQuestionToPool =async (req,res)=>{
    console.log("here" +req.body)
    const {courseId,courseName,question,questionType,correctOption,poolCategory,userId,options,questionImg,isMathJax}=(req.body);
    const addQuestionToPoolQuery="INSERT INTO poolquestions (courseId,courseName,question,questionType,correctOption,poolCategoryId,userId,questionImage,isMathjax) VALUES (?,?,?,?,?,?,?,?,?)";

    pool.query(addQuestionToPoolQuery,[courseId,courseName,question,questionType,correctOption,poolCategory,userId,questionImg,isMathJax],(err,row,field)=>{
        if (err) {
            console.log(err);
            res.status(500).json({
              success: 0,
              message: 'Cannot Add Question to Pool',
              err:err
            });
            return
        }

        if(questionType === "Mcq"){
            options.forEach((item,i)=>{
                pool.query("INSERT INTO questionOptions (questionId,options) VALUES (?,?)",[row.insertId,item],(err,row,field)=>{
                    //
                })
                })
            }
            if (questionType === "TRUE/FALSE" || questionType === "Subjective"){
                pool.query("INSERT INTO questionOptions (questionId,options) VALUES (?,?)",[row.insertId,correctOption],(err,row,field)=>{
                    // 
                })
                }
            console.log("Success");
            res.status(200).json({
            success: 1,
            message: 'Question Added Succesfully'
        });
    })
}

export const getPoolQuestions = async(req,res)=>{
    const {userId}=req.params;
    pool.query("select * from poolQuestions where userId=?",[userId],(err,row,field)=>{
        let data=[];
        let rowlength=row.length;
        row.forEach((d,index)=>{
            pool.query("select options from questionoptions where questionId=?",d.id,(err,row,field)=>{
                d.options=row;
                data.push(d)
                if(rowlength-1 === index){
                    res.send(data);
                    console.log(data)
                }
            })
        })
    })
}

export const deletQuestion = async(req,res)=>{
    console.log(req.body);
    const {id}=req.body;
    pool.query("delete from poolQuestions where id=?",[id],(err,row,field)=>{
        if(err) {
            res.status(400).json("Error deleting Questions")
            return    
        };
        pool.query("delete from questionoptions where questionId=?",id,(err,row,field)=>{
            if(err) {
                res.status(400).json("Error deleting Questions")
                return    
            };
            res.status(200).json("Question Deleted");
        })
    })
}