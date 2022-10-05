import express from 'express';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import { pool } from '../index.js';
dotenv.config();

export const quiz = async(req,res)=>
{
    const {title,questionShuffle,answerShuffle,seeAnswer,copyQuestion,detectMobile,startTime,endTime,questions,userId,courseId,totalPoints}=(req.body);
    const addQuestionToQuizQuery="INSERT INTO quiz (quizTitle,courseId,startTime,endTime,userId,questionShuffle,answerShuffle,seeAnswer,copyQuestion,detectMobile,totalPoints) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

    pool.query(addQuestionToQuizQuery,[title,courseId,startTime,endTime,userId,questionShuffle,answerShuffle,seeAnswer,copyQuestion,detectMobile,totalPoints],(errr,roww,fields)=>{
        if (errr) {
            console.log(errr);
            res.status(500).send({
              success: 0,
              message: 'Cannot Add Question to Pool',
              err:errr
            });
        }

        if(roww)
        {
            questions.forEach((item,indexs)=>{
                pool.query("INSERT INTO quizquestions (quizId,correctOption,isMathJax,questionType,question,questionImage,points,time) VALUES (?,?,?,?,?,?,?,?)",[roww.insertId,item.correctOption,item.isMathJax,item.questionType,item.question,item.questionImage,item.points,item.time],(err,row,field)=>{
                    if(err)
                    console.log(err)
                    if (row)
                    {
                        let length = questions.length
                        item.options.forEach((items,indexss) => {
                            if(items !== null)
                            {
                            pool.query("INSERT INTO quizquestionoptions (quizquestionId,options) VALUES (?,?)",[row.insertId,items],(error,rows,fields)=>{
                                if(error)
                                {
                                    console.log(error)
                                }
                                
                                if(indexs === length-1 && item.options.length-1 === indexss)
                                {
                                    console.log('sent')
                                    res.status(200).send({message:'Quiz Created'})}
                            })}
                            else
                            {
                                if(indexs === length-1)
                                {
                                    console.log('sent')
                                    res.status(200).send({message:'Quiz Created'})}
                               
                            }
                        })
                    }})
            })
        }
    })
}

export const editQuiz = async(req,res)=>
{
    const {id,title,questionShuffle,answerShuffle,seeAnswer,copyQuestion,detectMobile,startTime,endTime,questions,totalPoints,courseId,userId}=(req.body);
    const deleteQuestionToQuizQuery="DELETE from quiz WHERE id=?";
    const addQuestionToQuizQuery="INSERT INTO quiz (quizTitle,courseId,startTime,endTime,userId,questionShuffle,answerShuffle,seeAnswer,copyQuestion,detectMobile,totalPoints) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

    // id is quizId
    pool.query(deleteQuestionToQuizQuery,[id],(errr,roww,fields)=>{
        if (errr) {
            console.log(errr);
            res.status(500).send({
              success: 0,
              message: 'Cannot DELETE Quiz',
              err:errr
            });
        }

        if(roww)
        {
            pool.query(addQuestionToQuizQuery,[title,courseId,startTime,endTime,userId,questionShuffle,answerShuffle,seeAnswer,copyQuestion,detectMobile,totalPoints],(errr,roww,fields)=>{
                if (errr) {
                    console.log(errr);
                    res.status(500).send({
                      success: 0,
                      message: 'Cannot Add Question to Pool',
                      err:errr
                    });
                }
        
                if(roww)
                {
                    questions.forEach((item,indexs)=>{
                        pool.query("INSERT INTO quizquestions (quizId,correctOption,isMathJax,questionType,question,questionImage,points,time) VALUES (?,?,?,?,?,?,?,?)",[roww.insertId,item.correctOption,item.isMathJax,item.questionType,item.question,item.questionImage,item.points,item.time],(err,row,field)=>{
                            if(err)
                            console.log(err)
                            if (row)
                            {
                                let length = questions.length
                               
                                item.options.forEach((items,indexss) => {
                                    if(items !== null)
                                    {
                                    pool.query("INSERT INTO quizquestionoptions (quizquestionId,options) VALUES (?,?)",[row.insertId,items],(error,rows,fields)=>{
                                        if(error)
                                        {
                                            console.log(error)
                                        }
                                        
                                        if(indexs === length-1 && item.options.length-1 === indexss)
                                        {
                                            console.log('sent')
                                            res.status(200).send({message:'Quiz Created'})
                                        }
                                    })}
                                    else
                                    {
                                        if(indexs === length-1 && item.options.length-1 === indexss)
                                        {
                                            console.log('sent')
                                            res.status(200).send({message:'Quiz Created'})}
                                    }
                                })}
                            })
                    })
                }
            })
        }
    })

}

export const getAllQuizzes = async (req,res)=>{
    pool.query("select * from quiz where courseId=?",req.params.courseId,(err,row,field)=>{
        if(err){
            console.log(err)
            res.send(err)
            return
        }

        if(row.length === 0){
            res.status(200).send({data:[]})
            return
        } else {

        for(let i = 0;i<row.length;i++){
            pool.query("select * from quizquestions where quizId=?", [row[i].id],(err,row1)=>{
                if(err){
                    console.log(err)
                    res.send(err)
                    return
                }
        
                if(row1.length === 0){
                    res.status(200).send({data:[]})
                    return
                } else {

                for(let j=0;j<row1.length;j++){
                    pool.query("select * from quizquestionoptions where quizquestionid=?", [row1[j].id],(err,row2,field)=>{
                        row1[j].options=row2
                        row[i].questions=row1
                        if(i === row.length-1 && j===row1.length-1){ // question 3. quizoption=2. row.lenghth=3
                            res.status(200).send({data:row})
                        }
                    })
                }
                

                }
            })
        }
        }

    })
}

export const atempttedQuizQuestions = async(req,res)=>
{
    const {userId,quizId,quizQuestionId,correctOption,selectedOption,obtainedMarks}=(req.body);
    console.log(req.body)
    console.log('----------------------------------------------------------')
    pool.query('INSERT INTO attemptedquizquestions (userId,quizId,quizQuestionId,selectedOption,obtainedMarks) VALUES (?,?,?,?,?)',[userId,quizId,quizQuestionId,selectedOption,obtainedMarks],(err,row,fields)=>{
        if (err)
        console.log(err)
        
        res.send(row)
    })
}

export const getAtempttedQuizQuestions = async(req,res)=>
{
    const {userId,quizId} = req.params
    pool.query('SELECT * FROM attemptedquizquestions WHERE userId=? AND quizId=?',[userId,quizId],(err,row,field)=>{
        if (err)
        console.log(err)
        if(row)
        res.send(row)
    })
}

export const addQuizResult = async(req,res)=>
{
    const {userId,quizId} = req.body
    let totalQuestionsLength;
    let obtainedMarks=0;
    let totalMarks = 0;
    let attemptedQuestions = 0;

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
                pool.query('INSERT INTO quizresult (quizId,userId,totalMarks,obtainedMarks,attemptedQuestions,totalQuestions,cancelled) VALUES (?,?,?,?,?,?,false)',[quizId,userId,totalMarks,obtainedMarks,attemptedQuestions,totalQuestionsLength],(e,r,f)=>
                {
                        if(e)
                        {
                            console.log('error')    
                            console.log(e)
                        }

                        if(r)
                        res.send(r)
                })
                
            }
            })
        
        }})
}

export const showQuizResult =  async(req,res)=>
{
    const {userId,quizId} = req.params
    console.log('inside quiz result')
    
    pool.query('SELECT * FROM quizresult where userId=? AND quizId=?',[userId,quizId],(err,row,field)=>
    {
            if (err)
            console.log(err)
            if(res)
            {
            res.send(row)}
    })
}

export const quizDelete = async(req,res) =>
{
    const {id} = req.body
    pool.query('DELETE FROM quiz where id=?',id,(err,row,field)=>{
        if(err)
        console.log(err)
        if(row)
        res.status(200).send({message:"deleted"});
      })
}

export const getTabFocus = async(req,res) =>
{
    const {userId,quizId} = req.params
    pool.query('Select * FROM tabfocus where userId=? AND quizId=?',[userId,quizId],(err,row,field)=>{
        if(err)
        console.log(err)
        if(row)
        {
            res.status(200).send({data:row});
        }
      })
}

export const addToTabFocus = async(req,res) =>
{
    const {userId,quizId} = req.body

    function getTime() {
        var date = new Date()
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString();
    }
      
    let yourDate=getTime();
    yourDate=yourDate.toString().split("T");
    yourDate[1]=yourDate[1].toString().split(".")[0];
    yourDate=yourDate.toString().replaceAll(","," "); 
 
    pool.query('INSERT INTO tabfocus (userId,quizId,lostFocusTime) VALUES (?,?,?)',[userId,quizId,yourDate],(err,row,field)=>{
        if(err)
        console.log(err)
        if(row)
        {
            res.status(200).send({data:'Added'});
        }
      })
}

export const quizCancellResult = async(req,res) =>
{
    const {userId,quizId} = req.body
    let totalQuestionsLength;
    let obtainedMarks=0;
    let totalMarks = 0;
    let attemptedQuestions = 0;

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
                pool.query('INSERT INTO quizresult (quizId,userId,totalMarks,obtainedMarks,attemptedQuestions,totalQuestions,cancelled) VALUES (?,?,?,0,?,?,true)',[quizId,userId,totalMarks,attemptedQuestions,totalQuestionsLength],(e,r,f)=>
                {
                        if(e){
                            if(e.code === 'ER_DUP_ENTRY')
                            res.status(200).send({data:'Already added'});
                            else { console.log(e) }
                        }
                        if(r)
                        {
                            res.status(200).send({data:'Added'});
                        }
                })
            }
            })
        }})
}