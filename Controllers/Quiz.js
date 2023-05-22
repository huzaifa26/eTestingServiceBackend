import express from 'express';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import dayjs from "dayjs";
import {pool} from "../functions/api.js"
import { getUsers, io } from '../routes/routes.js'
import axios from 'axios'
import nodemailer from 'nodemailer'
dotenv.config();

export const quiz = async (req, res) => {
    const { title, questionShuffle, answerShuffle, seeAnswer, copyQuestion, detectMobile, startTime, endTime, questions, userId, courseId, totalPoints } = (req.body);
    const addQuestionToQuizQuery = "INSERT INTO quiz (quizTitle,courseId,startTime,endTime,userId,questionShuffle,answerShuffle,seeAnswer,copyQuestion,detectMobile,totalPoints) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

    pool.query(addQuestionToQuizQuery, [title, courseId, startTime, endTime, userId, questionShuffle, answerShuffle, seeAnswer, copyQuestion, detectMobile, totalPoints], (errr, roww, fields) => {
        if (errr) {
            console.log(errr);
            res.status(500).send({
                success: 0,
                message: 'Cannot Add Question to Pool',
                err: errr
            });
        }

        if (roww) {
            questions.forEach((item, indexs) => {
                pool.query("INSERT INTO quizquestions (quizId,correctOption,isMathJax,questionType,question,questionImage,points,time) VALUES (?,?,?,?,?,?,?,?)", [roww.insertId, item.correctOption, item.isMathJax, item.questionType, item.question, item.questionImage, item.points, item.time], (err, row, field) => {
                    if (err)
                        console.log(err)
                    if (row) {
                        let length = questions.length
                        console.log(item.options);
                        // console.log(questions.length);
                        // console.log(indexs + 1);
                        console.log(item.options.length);
                        if (item.options.length === 0) {

                            //do nothing
                            if (questions.length === indexs + 1) {
                                res.status(200).send({ message: 'Quiz Created' })
                            }

                        }
                        else {
                            item.options.forEach((items, indexss) => {
                                if (items !== null) {
                                    pool.query("INSERT INTO quizquestionoptions (quizquestionId,options) VALUES (?,?)", [row.insertId, items], (error, rows, fields) => {
                                        if (error) {
                                            console.log(error)
                                        }

                                        if (indexs === length - 1 && item.options.length - 1 === indexss) {
                                            res.status(200).send({ message: 'Quiz Created' })
                                        }
                                    })
                                }
                                else {
                                    if (indexs === length - 1 && item.length === indexss + 1) {
                                        res.status(200).send({ message: 'Quiz Created' })
                                    }

                                }
                            })
                        }
                    }
                })
            })
        }
    })
}

export const editQuiz = async (req, res) => {
    const { id, title, questionShuffle, answerShuffle, seeAnswer, copyQuestion, detectMobile, startTime, endTime, questions, totalPoints, courseId, userId } = (req.body);
    const deleteQuestionToQuizQuery = "DELETE from quiz WHERE id=?";
    const addQuestionToQuizQuery = "INSERT INTO quiz (quizTitle,courseId,startTime,endTime,userId,questionShuffle,answerShuffle,seeAnswer,copyQuestion,detectMobile,totalPoints) VALUES (?,?,?,?,?,?,?,?,?,?,?)";

    // id is quizId
    pool.query(deleteQuestionToQuizQuery, [id], (errr, roww, fields) => {
        if (errr) {
            console.log(errr);
            res.status(500).send({
                success: 0,
                message: 'Cannot DELETE Quiz',
                err: errr
            });
        }

        if (roww) {
            pool.query(addQuestionToQuizQuery, [title, courseId, startTime, endTime, userId, questionShuffle, answerShuffle, seeAnswer, copyQuestion, detectMobile, totalPoints], (errr, roww, fields) => {
                if (errr) {
                    console.log(errr);
                    res.status(500).send({
                        success: 0,
                        message: 'Cannot Add Question to Pool',
                        err: errr
                    });
                }

                if (roww) {
                    questions.forEach((item, indexs) => {
                        pool.query("INSERT INTO quizquestions (quizId,correctOption,isMathJax,questionType,question,questionImage,points,time) VALUES (?,?,?,?,?,?,?,?)", [roww.insertId, item.correctOption, item.isMathJax, item.questionType, item.question, item.questionImage, item.points, item.time], (err, row, field) => {
                            if (err)
                                console.log(err)
                            if (row) {
                                let length = questions.length

                                if (item.options.length === 0) {
                                    //do nothing
                                    if (questions.length === indexs + 1) {
                                        res.status(200).send({ message: 'Quiz Created' })
                                    }

                                }
                                else {
                                    item.options.forEach((items, indexss) => {
                                        if (items !== null) {
                                            pool.query("INSERT INTO quizquestionoptions (quizquestionId,options) VALUES (?,?)", [row.insertId, items], (error, rows, fields) => {
                                                if (error) {
                                                    console.log(error)
                                                }

                                                if (indexs === length - 1 && item.options.length - 1 === indexss) {
                                                    res.status(200).send({ message: 'Quiz Created' })
                                                }
                                            })
                                        }
                                        else {
                                            if (indexs === length - 1 && item.options.length - 1 === indexss) {
                                                res.status(200).send({ message: 'Quiz Created' })
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    })
                }
            })
        }
    })

}

export const getAllQuizzes = async (req, res) => {
    pool.query("select * from quiz where courseId=?", req.params.courseId, (err, row, field) => {
        if (err) {
            console.log(err)
            res.send(err)
            return
        }

        if (row.length === 0) {
            res.status(200).send({ data: [] })
            return
        } else {

            for (let i = 0; i < row.length; i++) {
                pool.query("select * from quizquestions where quizId=?", [row[i].id], (err, row1) => {
                    if (err) {
                        console.log(err)
                        res.send(err)
                        return
                    }

                    if (row1.length === 0) {
                        res.status(200).send({ data: [] })
                        return
                    } else {

                        for (let j = 0; j < row1.length; j++) {
                            pool.query("select * from quizquestionoptions where quizquestionid=?", [row1[j].id], (err, row2, field) => {
                                row1[j].options = row2
                                row[i].questions = row1
                                if (i === row.length - 1 && j === row1.length - 1) { // question 3. quizoption=2. row.lenghth=3
                                    res.status(200).send({ data: row })
                                }
                            })
                        }


                    }
                })
            }
        }

    })
}

export const atempttedQuizQuestions = async (req, res) => {
    const { userId, quizId, quizQuestionId, correctOption, selectedOption, obtainedMarks, subjective, points } = (req.body);

    if (subjective === true) {
        let data2 = {
            sentence1: correctOption,
            sentence2: selectedOption,
        }

        axios.post("http://127.0.0.1:8000/question-grading/", data2)
            .then((ress) => {
                function getMarks(score, maxMarks) {
                    return score * maxMarks;
                }
                const marks = getMarks(ress.data.grade, points)
                pool.query('INSERT INTO attemptedquizquestions (userId,quizId,quizQuestionId,selectedOption,obtainedMarks) VALUES (?,?,?,?,?)', [userId, quizId, quizQuestionId, selectedOption, marks], (err, row, fields) => {
                    if (err) { console.log(err) }
                    if (row) { console.log('added'); res.send(row); }
                })
            })
    }
    else {

        pool.query('INSERT INTO attemptedquizquestions (userId,quizId,quizQuestionId,selectedOption,obtainedMarks) VALUES (?,?,?,?,?)', [userId, quizId, quizQuestionId, selectedOption, obtainedMarks], (err, row, fields) => {
            if (err) { console.log(err) }
            if (row) { console.log('added'); res.send(row) }
        })
    }
}

export const getAtempttedQuizQuestions = async (req, res) => {
    const { userId, quizId } = req.params
    pool.query('SELECT * FROM attemptedquizquestions WHERE userId=? AND quizId=?', [userId, quizId], (err, row, field) => {
        if (err)
            console.log(err)
        if (row)
            res.send(row)
    })
}

export const addQuizResult = async (req, res) => {
    const { userId, quizId } = req.body
    let totalQuestionsLength;
    let obtainedMarks = 0;
    let totalMarks = 0;
    let attemptedQuestions = 0;

    pool.query('SELECT * FROM quizquestions WHERE quizId=?', [quizId], (err, row, field) => {
        if (err)
            console.log(err)
        if (row) {
            totalQuestionsLength = row.length
            row.forEach((value, index) => {
                totalMarks += value.points
            })
            console.log(userId, quizId)
            pool.query('SELECT * FROM attemptedquizquestions WHERE userId=? AND quizId=?', [userId, quizId], (error, rows, fields) => {
                if (error)
                    console.log(error)
                if (rows) {
                    console.log(rows)
                    attemptedQuestions = rows.length
                    rows.forEach((value, index) => {
                        obtainedMarks += (value.obtainedMarks)
                    }
                    )
                    pool.query('INSERT INTO quizresult (quizId,userId,totalMarks,obtainedMarks,attemptedQuestions,totalQuestions,cancelled) VALUES (?,?,?,?,?,?,false)', [quizId, userId, totalMarks, obtainedMarks, attemptedQuestions, totalQuestionsLength], (e, r, f) => {
                        if (e) {
                            console.log(e)
                        }

                        if (r)
                            res.send(r)
                    })

                }
            })

        }
    })
}

export const showQuizResult = async (req, res) => {
    const { userId, quizId } = req.params

    pool.query('SELECT * FROM quizresult where userId=? AND quizId=?', [userId, quizId], (err, row, field) => {
        if (err)
            console.log(err)
        if (res) {
            res.send(row)
        }
    })
}

export const quizDelete = async (req, res) => {
    const { id } = req.body
    pool.query('DELETE FROM quiz where id=?', id, (err, row, field) => {
        if (err)
            console.log(err)
        if (row)
            res.status(200).send({ message: "deleted" });
    })
}

export const getTabFocus = async (req, res) => {
    const { userId, quizId } = req.params
    pool.query('Select * FROM tabfocus where userId=? AND quizId=?', [userId, quizId], (err, row, field) => {
        if (err)
            console.log(err)
        if (row) {
            res.status(200).send({ data: row });
        }
    })
}

export const addToTabFocus = async (req, res) => {
    const { userId, quizId } = req.body

    function getTime() {
        var date = new Date()
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString();
    }

    let yourDate = getTime();
    yourDate = yourDate.toString().split("T");
    yourDate[1] = yourDate[1].toString().split(".")[0];
    yourDate = yourDate.toString().replaceAll(",", " ");

    pool.query('INSERT INTO tabfocus (userId,quizId,lostFocusTime) VALUES (?,?,?)', [userId, quizId, yourDate], (err, row, field) => {
        if (err)
            console.log(err)
        if (row) {
            res.status(200).send({ data: 'Added' });
        }
    })
}

export const quizCancellResult = async (req, res) => {
    const { userId, quizId } = req.body
    let totalQuestionsLength;
    let obtainedMarks = 0;
    let totalMarks = 0;
    let attemptedQuestions = 0;
    try {
        let row = await pool.query('SELECT * FROM quizquestions WHERE quizId=?', [quizId])
        totalQuestionsLength = row.length
        row.forEach((value) => {
            totalMarks += value.points
        })
        let rows = await pool.query('SELECT obtainedMarks FROM attemptedquizquestions WHERE userId=? AND quizId=?', [userId, quizId])
        attemptedQuestions = rows.length
        rows.forEach((value) => {
            obtainedMarks += (value.obtainedMarks)
        }
        )
        let r = await pool.query('INSERT INTO quizresult (quizId,userId,totalMarks,obtainedMarks,attemptedQuestions,totalQuestions,cancelled) VALUES (?,?,?,0,?,?,true)', [quizId, userId, totalMarks, attemptedQuestions, totalQuestionsLength])
        res.status(200).send({ data: 'Added' });
    }
    catch (e) {
        if (e.code === 'ER_DUP_ENTRY')
            res.status(200).send({ data: 'Already added' });
        else { console.log(e) }

    }
}


export const QuizNotification = async (req, res) => {

    function getDifference(createdAt) {
        const firstDate = dayjs(createdAt);
        const currentDate = dayjs();
        const differenceInMinutes = currentDate.diff(firstDate, "minute");

        if (differenceInMinutes < 60) {
            return `${differenceInMinutes}m`;
        }
        else {
            return 'not reached 5m'
        }
    }

    pool.query('SELECT quiz.quizTitle,quiz.courseId,quiz.startTime,courses.courseName FROM quiz INNER JOIN courses ON quiz.courseId = courses.id;', [], (err, row, field) => {
        if (err) { console.log(err) }
        if (row) {
            let quizTitle = row.quizTitle
            let courseName = row.courseName

            row.forEach((item, index) => {
                // console.log(getDifference(item.startTime))

                if (getDifference(item.startTime) === '-4m') {
                    console.log('Time has reached of' + "-------" + item.courseId)
                    pool.query('Select * FROM enrolled INNER JOIN user ON enrolled.userId= user.id where enrolled.courseId=?', [item.courseId], (e, r, f) => {
                        if (e) { console.log(e) }
                        if (r) {

                            r.forEach((v, i) => {

                                let notificationText = item.courseName + ": " + item.quizTitle + ' quiz will start in 5 minutes.'
                                let transporter = nodemailer.createTransport({
                                    service: 'gmail', // use SSL
                                    auth: {
                                        user: 'hamzamushtaq840@gmail.com',
                                        pass: 'ksegtnxyhtiduybv'
                                    }
                                });

                                // setup email data
                                let mailOptions = {
                                    from: '"E TESTING SERVICE" <hamzamushtaq.187@gmail.com>',
                                    to: v.email, // list of receivers
                                    subject: 'QUIZ ALERT', // Subject line
                                    text: notificationText, // plain text body
                                };


                                transporter.sendMail(mailOptions, (error, info) => {
                                    if (error) {
                                        return console.log(error);
                                    }
                                    if (info) {
                                        //Do nothing
                                        // console.log('Message sent: %s', info.messageId);
                                    }
                                });


                                let type = 'quizTime'
                                pool.query('Insert into notification (courseId,userId,notificationText,type) VALUES (?,?,?,?)', [item.courseId, v.userId, notificationText, type], (e, r, f) => {
                                    if (e) { console.log(e) }
                                    if (r) {
                                        //email hehe
                                        const reciever = getUsers(v.userId)
                                        io.to(reciever?.socketId).emit('getQuizTime', {})
                                    }
                                })
                            })
                        }
                    })
                };
            })
        }
    })

}

export const getAllResult = async (req, res) => {
    const { quizId, courseId, quizPoints, totalQuestions } = req.params
    console.log(quizPoints);

    pool.query('SELECT userId FROM enrolled WHERE courseId=?', [courseId], (err, row, field) => {
        if (err)
            console.log(err)
        if (row) {
            row.forEach((value, index) => {
                pool.query('SELECT * from quizresult WHERE userId=? AND quizId=?', [value.userId, quizId], (err, rows, field) => {
                    if (err)
                        console.log(err)
                    if (rows) {
                        if (rows.length === 0) {
                            let obtainedMarks = 0;
                            let attemptedQuestions = 0;

                            pool.query('INSERT INTO quizresult (quizId,userId,totalMarks,obtainedMarks,attemptedQuestions,totalQuestions,cancelled) VALUES (?,?,?,?,?,?,false)', [quizId, value.userId, quizPoints, obtainedMarks, attemptedQuestions, totalQuestions], (e, r, f) => {
                                if (e) {
                                    console.log(e)
                                }
                                if (r) {
                                    //do nothing
                                }
                            })
                        }
                    }
                    if (row.length === index + 1) {
                        pool.query('SELECT quizresult.id,quizresult.quizId,quizresult.userId,quizresult.totalMarks,quizresult.obtainedMarks,quizresult.attemptedQuestions,quizresult.totalQuestions,user.fullName,user.email from quizresult INNER JOIN user ON quizresult.userId = user.id where quizresult.quizId=?', [quizId], (err, rowww, field) => {
                            if (err)
                                console.log(err)
                            if (rowww) {
                                rowww.forEach((value, inde) => {
                                    pool.query('SELECT * FROM tabfocus WHERE userId=? AND quizId=?', [value.userId, quizId], (err, ro, field) => {
                                        if (err)
                                            console.log(err)
                                        if (ro) {
                                            rowww[inde].log = ro
                                            if (rowww.length === inde + 1) {

                                                rowww.forEach((abc, en) => {
                                                    pool.query('SELECT attemptedquizquestions.id,attemptedquizquestions.userId,attemptedquizquestions.quizId,attemptedquizquestions.quizQuestionId,attemptedquizquestions.selectedOption,attemptedquizquestions.obtainedMarks,quizquestions.question,quizquestions.correctOption,quizquestions.questionType FROM attemptedquizquestions INNER JOIN quizquestions ON attemptedquizquestions.quizQuestionId = quizquestions.id WHERE attemptedquizquestions.userId=? AND attemptedquizquestions.quizId=?', [abc.userId, quizId], (err, roo, field) => {
                                                        if (err)
                                                            console.log(err)
                                                        if (roo) {
                                                            rowww[en].attemptedQuestions = roo
                                                            if (rowww.length === inde + 1 && rowww.length === en + 1) {
                                                                res.send(rowww)
                                                            }
                                                        }
                                                    })


                                                })

                                            }
                                        }
                                    })

                                })


                            }
                        })

                    }
                })

            })
        }
    })






    // pool.query('SELECT * FROM attemptedquizquestions WHERE userId=? AND quizId=?', [userId, quizId], (err, row, field) => {
    //     if (err)
    //         console.log(err)
    //     if (row)
    //         res.send(row)
    // })

    console.log(req.params);
}








// export const editQuiz = async (req, res) => {
//     const { id, title, questionShuffle, answerShuffle, seeAnswer, copyQuestion, detectMobile, startTime, endTime, questions, totalPoints, courseId, userId } = (req.body);
//     // const deleteQuestionToQuizQuery = "DELETE from quiz WHERE id=?";
//     const addQuestionToQuizQuery = "UPDATE quiz set quizTitle=?,courseId=?,startTime=?,endTime=?,userId=?,questionShuffle=?,answerShuffle=?,seeAnswer=?,copyQuestion=?,detectMobile=?,totalPoints=? where id=?";

//     pool.query(addQuestionToQuizQuery, [title, courseId, startTime, endTime, userId, questionShuffle, answerShuffle, seeAnswer, copyQuestion, detectMobile, totalPoints,id], (errr, roww, fields) => {
//         if (errr) {
//             console.log(errr);
//             res.status(500).send({
//                 success: 0,
//                 message: 'Cannot Add Question to Pool',
//                 err: errr
//             });
//         }

//         if (roww) {
//             questions.forEach((item, indexs) => {
//                 pool.query("UPDATE quizquestions SET correctOption=?,isMathJax=?,questionType=?,question=?,questionImage=?,points=?,time=? where quizId=?", [item.correctOption, item.isMathJax, item.questionType, item.question, item.questionImage, item.points, item.time, item.quizId], (err, row, field) => {
//                     if (err)
//                         console.log(err)
//                     if (row) {
//                         let length = questions.length

//                         if (item.options.length === 0) {
//                             //do nothing
//                             if (questions.length === indexs + 1) {
//                                 res.status(200).send({ message: 'Quiz Created' })
//                             }

//                         }
//                         else {
//                             item.options.forEach((items, indexss) => {
//                                 if (items !== null) {
//                                     pool.query("UPDATE quizquestionoptions SET options=? where id=?", [items.options,items.id], (error, rows, fields) => {
//                                         if (error) {
//                                             console.log(error)
//                                         }

//                                         if (indexs === length - 1 && item.options.length - 1 === indexss) {
//                                             res.status(200).send({ message: 'Quiz Created' })
//                                         }
//                                     })
//                                 }
//                                 else {
//                                     if (indexs === length - 1 && item.options.length - 1 === indexss) {
//                                         res.status(200).send({ message: 'Quiz Created' })
//                                     }
//                                 }
//                             })
//                         }
//                     }
//                 })
//             })
//         }
//     })



// }