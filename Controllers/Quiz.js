import express from 'express';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import { pool } from '../index.js';
dotenv.config();

export const quiz = async(req,res)=>
{
    const {title,questionShuffle,answerShuffle,seeAnswer,copyQuestion,detectMobile,startTime,endTime,questions,userId,courseId,totalPoints}=(req.body);
    const addQuestionToQuizQuery="INSERT INTO quiz (quizTitle,courseId,startTime,endTime,userId,questionShuffle,answerShuffle,seeAnswer,copyQuestion,detectMobile,totalPoints) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
    console.log('i am here')

    pool.query(addQuestionToQuizQuery,[title,courseId,startTime,endTime,userId,questionShuffle,answerShuffle,seeAnswer,copyQuestion,detectMobile,totalPoints],(errr,roww,fields)=>{
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
                            if(item !== null)
                            {
                            pool.query("INSERT INTO quizquestionoptions (quizquestionId,options) VALUES (?,?)",[row.insertId,item],(error,rows,fields)=>{
                                if(error)
                                console.log(error)
                                if (rows){console.log('got response')}
                            })}
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
                    {rows.forEach((item,i) =>
                    {   pool.query('select * from quizquestionoptions where quizquestionid=?',[item.id],(e,r,f)=>
                        {   if(e)
                            {console.log(e)}
                            if(r)
                            {   item.options = r
                                if(index === quiz.length-1)
                                {res.status(200).json({data:quiz})}
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

export const atempttedQuizQuestions = async(req,res)=>
{
    const {userId,quizId,quizQuestionId,correctOption,selectedOption,obtainedMarks}=(req.body);
    pool.query('INSERT INTO attemptedquizquestions (userId,quizId,quizQuestionId,selectedOption,obtainedMarks) VALUES (?,?,?,?,?)',[userId,quizId,quizQuestionId,selectedOption,obtainedMarks],(err,row,fields)=>{
        if (err)
        console.log(err)
        if(row)
        console.log(row)
    })
}

export const getAtempttedQuizQuestions = async(req,res)=>
{
    const {userId,quizId} = req.params
    console.log('i am here')
    console.log(userId)
    console.log(quizId)
    pool.query('SELECT * FROM attemptedquizquestions WHERE userId=? AND quizId=?',[userId,quizId],(err,row,field)=>{
        if (err)
        console.log(err)
        if(row)
        console.log(row)
        res.send(row)
    })
}

export const addQuizResult = async(req,res)=>
{
    const {userId,quizId} = req.body
    let totalQuestionsLength;
    let obtainedMarks=0;
    let totalMarks = 0
    let attemptedQuestions = 0

    pool.query('SELECT * FROM quizquestions WHERE quizId=?',[quizId],(err,row,field)=>{
        if (err)
        console.log(err)
        if (row)
        {
            totalQuestionsLength = row.length
            row.forEach((value,index) =>
            {
                totalMarks += value.points
            })
            console.log(row)
            pool.query('SELECT obtainedMarks FROM attemptedquizquestions WHERE userId=? AND quizId=?',[userId,quizId],(error,rows,fields)=>{
                if (error)
                console.log(error)
                if(rows)
                {
                attemptedQuestions = rows.length
                rows.forEach((value,index) =>
                {
                    obtainedMarks +=(value.obtainedMarks)
                }
                )
                console.log(obtainedMarks)
                pool.query('INSERT INTO quizresult (quizId,userId,totalMarks,obtainedMarks,attemptedQuestions,totalQuestions) VALUES (?,?,?,?,?,?)',[quizId,userId,totalMarks,obtainedMarks,attemptedQuestions,totalQuestionsLength],(e,r,f)=>
                {
                        if(e)
                        console.log('error')    
                        if(r)
                        console.log(r)
                        res.send(r)
                })
                
            }
            })
        
        }})
}

export const showQuizResult =  async(req,res)=>
{
    const {userId,quizId} = req.params
    console.log(userId)
    console.log(quizId)
    pool.query('SELECT * FROM quizresult where userId=? AND quizId=?',[userId,quizId],(err,row,field)=>
    {
            if (err)
            console.log(err)
            if(res)
            {console.log(row)
            res.send(row)}
    })
}