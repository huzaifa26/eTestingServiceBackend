import express from 'express';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import { pool } from '../index.js';
dotenv.config();

export const uploadAssignment = async (req, res) => {
    const { courseId, fileUrl, fileName, fileType, title, startTime, endTime, totalMarks } = (req.body)

    pool.query('INSERT INTO assignment (assignmentTitle,courseId,fileUrl,fileName,fileType,startTime,endTime,totalMarks) VALUES (?,?,?,?,?,?,?,?) ', [title, courseId, fileUrl, fileName, fileType, startTime, endTime, totalMarks], (err, row, field) => {
        if (err)
            console.log(err)
        if (row)
            res.status(200).send({ message: 'Assignment added', });
    })
}

export const getAssignments = async (req, res) => {
    pool.query('select * from assignment where courseId=?', req.params.courseId, (err, row, field) => {
        if (row.length === 0) {
            res.send({ data: row });
        }
        for (let i = 0; i < row.length; i++) {
            pool.query("select * from submittedassignments where assignmentId=? and userId=?", [row[i].id, req.params.userId], (err, row1, field) => {
                if (err) res.send(err)

                if (row1?.length === 0) {
                    row[i].submitted = 0;
                }
                if (row1?.length > 0) {
                    row[i].submitted = 1;
                }

                if (i === row.length - 1) {
                    res.send({ data: row });
                }
            })
        }
    })
}

export const editAssignment = async (req, res) => {

    const { id, courseId, fileUrl, fileName, fileType, title, startTime, endTime, totalMarks } = (req.body)

    pool.query('Update assignment SET assignmentTitle=?,courseId=?,fileUrl=?,fileName=?,fileType=?,startTime=?,endTime=?,totalMarks=? WHERE id=? ', [title, courseId, fileUrl, fileName, fileType, startTime, endTime, totalMarks, id], (err, row, field) => {
        if (err)
            console.log(err)
        if (row) {
            res.status(200).send({ message: 'Assignment added', })
        };
    })
}
export const deleteAssignment = async (req, res) => {

    pool.query('DELETE FROM assignment where id=?', req.params.id, (err, row, field) => {
        if (err)
            console.log(err)
        if (row)
            res.status(200).send({ message: "deleted" });
    })
}

export const submitAssignment = async (req, res) => {
    const { assignmentId, userId, submittedTime, fileUrl } = (req.body)

    pool.query('INSERT into submittedassignments (assignmentId,userId,submittedTime,fileUrl) VALUES (?,?,?,?)', [assignmentId, userId, submittedTime, fileUrl], (err, row, field) => {
        if (err)
            console.log(err)
        if (row) {
            res.status(200).send({ message: 'Assignment submitted', })
            console.log(row)
        };
    })
}

export const getAssignmentResult = async (req, res) => {

    pool.query('SELECT submittedassignments.id,submittedassignments.submittedTime,submittedassignments.fileUrl,submittedassignments.obtainedMarks,user.fullName,user.email FROM submittedassignments INNER JOIN user ON submittedassignments.userId = user.id WHERE submittedassignments.assignmentId=?', req.params.id, (err, row, field) => {
        if (err)
            console.log(err)
        if (row)
            res.status(200).send({ data: row });
    })
}

export const updateAssignmentResult = async (req, res) => {
    const students = req.body

    students.forEach((element, index) => {
        pool.query('UPDATE submittedassignments SET obtainedMarks=? WHERE id=?', [element.obtainedMarks, element.id], (err, row, field) => {
            {
                if (err)
                    console.log(err)
                if (students.length === index + 1) {
                    res.status(200).send({ message: 'sucess' });
                }
            }
        })

    });

}
export const getStudentResult = async (req, res) => {
    const { userId, assignmentId } = req.params
    pool.query('SELECT * FROM submittedassignments where userId=? and assignmentId=?', [userId, assignmentId], (err, row, field) => {
        if (err) { console.log(err) }
        if (row) { res.status(200).send({ data: row }) }
    })
}
