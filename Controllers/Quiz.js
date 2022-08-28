import express from 'express';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import { pool } from '../index.js';
dotenv.config();

export const quiz = async(req,res)=>
{
    const {title,questionShuffle,answerShuffle,seeAnswer,copyQuestion,detectMobile,startTime,endTime,questions,userId,courseId}=(req.body);
    const addQuestionToQuizQuery="INSERT INTO quiz (quizTitle,courseId,startTime,endTime,userId,questionShuffle,answerShuffle,seeAnswer,copyQuestion,detectMobile) VALUES (?,?,?,?,?,?,?,?,?,?)";

    pool.query(addQuestionToQuizQuery,[title,courseId,startTime,endTime,userId,questionShuffle,answerShuffle,seeAnswer,copyQuestion,detectMobile],(errr,roww,fields)=>{
        if (errr) {
            console.log(errr);
            res.status(500).json({
              success: 0,
              message: 'Cannot Add Question to Pool',
              err:errr
            });
        }

        if(roww)
        {
            questions.forEach((item,index)=>{
                pool.query("INSERT INTO quizquestions (quizId,correctOption,isMathJax,questionType,question,questionImage,points,time) VALUES (?,?,?,?,?,?,?,?)",[roww.insertId,item.correctOption,item.isMathJax,item.questionType,item.question,item.questionImg,item.points,item.time],(err,row,field)=>{
                    if(err)
                    console.log(err)
                    if (row)
                    {
                        item.options.forEach((item,index) => {
                            pool.query("INSERT INTO quizquestionoptions (quizquestionId,options) VALUES (?,?)",[row.insertId,item],(error,rows,fields)=>{
                                if(error)
                                console.log(error)
                                if (rows){console.log('got response')}
                            })
                        })
                    }})
            })
        }
    })
}

export const getAllQuizzes = async(req,res)=>
{
  let quiz=[]
  let quizQuestion = []
  const sqlQuery="select * from quiz where courseId=?";
  pool.query(sqlQuery,req.params.courseId,(err,row,field)=>{
    if (err){console.log(err)}
    if (row)
    {
        quiz.push(...row)
        row.forEach((value,index) => {
                pool.query("select * from quizquestions where quizId=?",[row[index].id],(error,rows,fields) =>
                {   if(error)
                    {console.log(err)}
                    if(rows)
                    {
                    rows.forEach((item,i) =>
                    {   pool.query('select * from quizquestionoptions where quizquestionid=?',[item.id],(e,r,f)=>
                        {   if(e)
                            console.log(e)
                            if(r)
                            {   console.log(r)
                                item.options = r
                                console.log('i ran at last')
                                if(index === quiz.length-1)
                                {   console.log('DATA IS SENT')
                                    res.status(200).json({data:quiz});
                                }
                            }
                        })
                    })
                    value.questions=rows
                    quizQuestion.push(value)
                }
                })
        })
    }      
  })
}