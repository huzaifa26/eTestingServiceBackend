import express from 'express';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import { pool } from '../index.js';
dotenv.config();

export const createPoolCategory = async(req,res)=>{

    const {courseId,userId,categoryName}=req.body;

    const createPoolQuery="INSERT INTO poolCategory (courseId,userId,categoryName) VALUES (?,?,?)";

    pool.query(createPoolQuery,[courseId,userId,categoryName],(err,row,field)=>{
        console.log(err);
        if (err) {
            console.log(err);
            res.status(500).send({
              success: 0,
              message: 'Cannot Register Pool Category',
              err:err
            });
          }
        if (row) {
              res.status(200).send({
              success: 1,
              message: 'Pool Category Registered',
            });
          }
    })
}


export const getPoolCategory = async(req,res)=>{

    const {courseId,userId}=req.params;

    const createPoolQuery="SELECT * from poolCategory where courseId=? and userId=?";

    pool.query(createPoolQuery,[courseId,userId],(err,row,field)=>{
        console.log(row)
        res.status(200).send({data:row});
    })
}

export const addQuestionToPool =async (req,res)=>{
    console.log(req.body)

    const {courseId,poolCategory,userId,courseName,question,questionImage,correctOption,questionType,isMathJax,points,time,options}=(req.body);
    const addQuestionToPoolQuery="INSERT INTO poolquestions (courseId,poolCategory,userId,courseName,question,questionImage,correctOption,questionType,isMathJax,points,time) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";

    pool.query("INSERT INTO poolquestions (courseId,poolCategoryId,userId,courseName,question,questionImage,correctOption,questionType,isMathJax,points,time) VALUES (?,?,?,?,?,?,?,?,?,?,?)",[courseId,poolCategory,userId,courseName,question,questionImage,correctOption,questionType,isMathJax,points,time],(err,row,field)=>{
        if(err)
        console.log(err)
        if (row)
        {
            options.forEach((item,index) => {
                if(item !== null)
                {
                pool.query("INSERT INTO poolquestionoptions (poolquestionId,options) VALUES (?,?)",[row.insertId,item],(error,rows,fields)=>{
                    if(error)
                    console.log(error)
                })}
                if(index+1 === options.length)
                { res.status(200).send("Added")}
            })
        }})
}

export const getPoolQuestions = async(req,res)=>{
    const {userId}=req.params;
    pool.query("select * from poolquestions where userId=?",[userId],(err,row,field)=>{
        let data=[];
        let rowlength=row.length;
        row.forEach((d,index)=>{
            // console.log(d)
            pool.query("select options from poolquestionoptions where questionId=?",d.id,(err,row,field)=>{
                d.options=row;
                data.push(d)
                if(rowlength-1 === index){
                    res.send(data);
                }
            })
        })
    })
}

export const deletQuestion = async(req,res)=>{
    const {id}=req.body;
    pool.query("delete from poolQuestions where id=?",[id],(err,row,field)=>{
        if(err) {
            res.status(400).send("Error deleting Questions")
            return    
        };
        pool.query("delete from poolquestionoptions where questionId=?",id,(err,row,field)=>{
            if(err) {
                res.status(400).send("Error deleting Options of Pools")
                return    
            };
            res.status(200).send("Question Deleted");
        })
    })
}

export const editQuestionToPool =async (req,res)=>{
    const {id,courseId,poolCategoryId,userId,courseName,question,questionImage,correctOption,questionType,isMathJax,points,time,options}=(req.body);

    pool.query("delete from poolquestionoptions where poolquestionId=?",id,(err,row,field)=>{
        if(err) {
            res.status(400).send("Error deleting Options of Pools")
            return    
        };
        if(row)
        {
            console.log('deleted')
            pool.query('Update poolquestions SET courseId=?,poolCategoryId=?,userId=?,courseName=?,question=?,questionImage=?,correctOption=?,questionType=?,isMathJax=?,points=?,time=? WHERE id=? ',[courseId,poolCategoryId,userId,courseName,question,questionImage,correctOption,questionType,isMathJax,points,time,id],(err,row,field) =>
            {
                if(err)
                console.log(err)
                if(row){
                    console.log('updated')
                    options.forEach((item,index) => {
                        // console.log(index+1)
                        // console.log(options.length)
                        // console.log(item)
                        if(item !== null)
                        {
                        pool.query("INSERT INTO poolquestionoptions (poolquestionId,options) VALUES (?,?)",[id,item],(error,rows,fields)=>{
                            if(error)
                            console.log(error)
                            if(res)
                            {
                                console.log('res')
                            }
                        })}
                    })
                };
            })

        }
        res.status(200).send("Question Deleted");
    })

    
    
}

export const getPoolQuestions2 = (req,res)=>{
    const {courseId,userId}=req.params;
    let data = []
    let newArr=[]
    // console.log(userId,courseId)
  
    pool.query("SELECT * from poolquestions where userId=? AND courseid=?",[userId,courseId],(err,row,field) =>{
        if(err) {console.log(err)}
        if(row)
        {
            console.log('got response'+'\n')
            data.push(...row)
            
            data.forEach((value,index) =>{
                // console.log(data)
                pool.query("SELECT * from poolquestionoptions where poolquestionId=?",[value.id],(error,rows,fields) =>{
                    if(error){console.log(error)}
                    if(rows)
                    {
                        value.options =rows
                        newArr.push(value);
                        if(index === data.length-1){
                          res.send(newArr);
                        }
                    }
                })   
            })
        }
    })
  }

  
export const deletePoolCategory = async (req,res) =>
{

    const {id} =req.body
    pool.query('DELETE FROM poolcategory where id=?',id,(err,row,field)=>{
      if(err)
      console.log(err)
      if(row)
      res.status(200).send({message:"deleted"});
    })
}