import express from 'express';
import dotenv from 'dotenv';
import Jwt from 'jsonwebtoken';
import { pool } from '../index.js';
import { getUsers, io } from '../routes/routes.js'
dotenv.config();

export const CreateCourse = async (req, res) => {
  const { userId, imageUrl, courseName, description, createTime } = req.body;
  const createCourseQuery = "INSERT INTO courses (userId,imageUrl,courseName,courseDescription,createTime,courseKey) VALUES (?,?,?,?,?,?)";
  var count = 6
  var chars = 'acdefhiklmnoqrstuvwxyz0123456789'.split('');
  var result = '';
  for (var i = 0; i < 6; i++) {
    var x = Math.floor(Math.random() * chars.length);
    result += chars[x];
  }

  pool.query(createCourseQuery, [userId, imageUrl, courseName, description, createTime, result], (err, row, field) => {
    console.log(err);
    if (err) {
      console.log(err);
      res.status(500).send({
        success: 0,
        message: 'Cannot Register Course',
        err: err
      });
    } else {
      res.status(200).send({
        success: 1,
        message: 'Course Registered',
        id: row.insertId,
      });
    }
  })
}

export const getCourses = async (req, res) => {
  const { userId } = req.params;
  const sqlQuery = "select * from courses where userId=?";
  pool.query(sqlQuery, [userId], (err, row, field) => {
    res.status(200).send({ data: row });
  })
}
export const getJoinedCourses = async (req, res) => {
  const { userId } = req.params;
  pool.query("SELECT courses.id,enrolled.blocked,courses.userId,courses.courseDescription,courses.courseName,courses.imageUrl FROM courses INNER JOIN enrolled ON courses.id = enrolled.courseId WHERE enrolled.userId=?", [userId], (err, row, field) => {
    if (err) {
      console.log(err)
    }
    if (row) {
      res.status(200).send({ data: row })
    }
  })
}

export const getCourseNames = async (req, res) => {
  const sqlQuery = "select id,courseName from courses where userId=?";
  pool.query(sqlQuery, req.params.userId, (err, row, field) => {
    res.status(200).send({ data: row });
  })
}


export const getCourseCategories = async (req, res) => {
  const sqlQuery = "SELECT poolcategory.id,poolcategory.courseId,poolcategory.categoryName,courses.courseName from poolcategory INNER JOIN courses ON poolcategory.courseId = courses.id WHERE courseId=?";
  pool.query(sqlQuery, req.params.courseId, (err, row, field) => {
    res.status(200).send({ data: row });
  })
}


export const joinCourse = async (req, res) => {
  const { userId, joiningkey, joinTime } = req.body
  pool.query("Select * from courses where courseKey=?", joiningkey, (err, row, field) => {
    if (err) { console.log(err) }
    if (row) {
      if (row.length === 0) { res.status(400).send({ message: 'Wrong Key' }) }
      if (row.length > 0) {
        pool.query("Insert into enrolled (courseId,userId,joinedTime,blocked) VALUES (?,?,?,?)", [row[0].id, userId, joinTime, 0], (error, rows, field) => {
          if (error) {
            console.log(error)
            if (error.code === 'ER_DUP_ENTRY') { res.status(401).send({ message: 'Duplicate' }) }
            else
              console.log("error: " + error);
          }
          console.log(rows);
          if (rows) {
            if (rows.affectedRows === 1) { res.status(200).send({ message: 'success' }) }
            else { console.log("at joinCourse") }
          }
        })
      }
    }
  })
}

export const CourseContent = async (req, res) => {
  const { courseId, fileUrl, fileName, fileType, createdTime, title } = (req.body)
  const queryCourseContent = "INSERT INTO coursecontent (courseId,fileUrl,fileName,fileType,createdTime,title) VALUES (?,?,?,?,?,?)";

  pool.query(queryCourseContent, [courseId, fileUrl, fileName, fileType, createdTime, title], (err, row, field) => {
    if (err) {
      console.log(err)
    }
    if (row) {
      res.status(200).send({ message: 'Content Uploaded', })
    }
  }
  )
}

export const getCourseContent = async (req, res) => {
  const queryCourseContent = "select id,fileUrl,fileName,fileType,createdTime,title from coursecontent where courseId=?";

  pool.query(queryCourseContent, req.params.courseId, (err, row, field) => {
    res.status(200).send({ data: row });
  })
}

export const enrolledLength = async (req, res) => {
  const queryCourseContent = "SELECT * FROM enrolled where courseId=?";

  pool.query(queryCourseContent, req.params.courseId, (err, row, field) => {
    if (err)
      console.log(err)
    if (row)
      res.status(200).send({ data: row.length });
  })
}

export const courseSetting = async (req, res) => {
  const queryCourseContent = "SELECT * FROM courses where id=?";
  pool.query(queryCourseContent, req.params.courseId, (err, row, field) => {
    if (err)
      console.log(err)
    if (row)
      res.status(200).send({ data: row });
  })

}

export const updateSetting = (req, res) => {
  const { courseName, courseDescription, imageUrl, id } = (req.body)

  pool.query('Update courses SET courseName=?,courseDescription=?,imageUrl=? WHERE id=?', [courseName, courseDescription, imageUrl, id], (err, row, field) => {
    if (err)
      console.log(err)
    if (row) {
      res.status(200).send({ message: 'Setting updated', })
    };
  })
}

export const deleteCourse = (req, res) => {
  const { courseIdredux } = (req.body)
  pool.query('DELETE FROM courses WHERE id = ?', [courseIdredux], (err, row, field) => {
    if (err)
      console.log(err)
    if (row) {
      res.status(200).send({ message: 'Course Deleted', })
    };
  })
}

export const manageUsers = (req, res) => {
  const { courseIdredux } = (req.body)
  pool.query('SELECT * FROM enrolled INNER JOIN user ON enrolled.userId = user.id WHERE enrolled.courseId=?', [courseIdredux], (err, row, field) => {
    if (err)
      console.log(err)
    if (row) {
      res.status(200).send({ data: row, })
    };
  })
}

export const deleteUserFromCourse = (req, res) => {
  const { id, courseId } = (req.body)
  pool.query('DELETE from enrolled WHERE userId=? and courseId=?', [id, courseId], (err, row, field) => {
    if (err)
      console.log(err)
    if (row) {
      res.status(200).send({ message: 'deleted', })
    };
  })
}

export const blockUserFromCourse = (req, res) => {
  const { id, courseId } = (req.body)
  pool.query('Select * from courses where id=?', courseId, (error, row, field) => {
    if (error)
      console.log(error)
    if (row) {
      let text = 'Your access was restricted in ' + row[0].courseName + ' class.'
      pool.query('Insert into notification (courseId,userId,notificationText,type) VALUES(?,?,?,?)', [courseId, id, text, 'blocked'], (e, r, f) => {
        if (e)
          console.log(e)
        if (r) {
          pool.query('UPDATE enrolled SET blocked=1 WHERE userId=? and courseId=?', [id, courseId], (err, row, field) => {
            if (err)
              console.log(err)
            if (row) {
              // const reciever = getUsers(id)
              // io.to(reciever?.socketId).emit('getNotification', {})
              res.status(200).send({ message: 'blocked', })
            };
          })
        }
      })
    }
  })

}

export const unblockUserFromCourse = (req, res) => {
  const { id, courseId } = (req.body)

  pool.query('Select * from courses where id=?', courseId, (error, row, field) => {
    if (error)
      console.log(error)
    if (row) {
      let text = 'Your access was unrestricted in ' + row[0].courseName + ' class.'
      pool.query('Insert into notification (courseId,userId,notificationText,type) VALUES(?,?,?,?)', [courseId, id, text, 'unblocked'], (e, r, f) => {
        if (e)
          console.log(e)
        if (r) {

          pool.query('UPDATE enrolled SET blocked=0 WHERE userId=? and courseId', [id, courseId], (err, row, field) => {
            if (err)
              console.log(err)
            if (row) {
              // const reciever = getUsers(id)
              // io.to(reciever?.socketId).emit('getNotification', {})
              res.status(200).send({ message: 'unblocked', })
            };
          })
        }
      })
    }
  })
}

export const changeKey = (req, res) => {
  let { courseIdredux } = (req.body)
  var count = 6
  var chars = 'acdefhiklmnoqrstuvwxyz0123456789'.split('');
  var result = '';
  for (var i = 0; i < 6; i++) {
    var x = Math.floor(Math.random() * chars.length);
    result += chars[x];
  }
  pool.query('UPDATE courses SET courseKey=? WHERE id=?', [result, courseIdredux], (err, row, field) => {
    if (err)
      console.log(err)
    if (row) {
      res.status(200).send({ message: 'Key Changed', })
    };
  })
}

export const getNotification = (req, res) => {
  const { userId } = req.params
  pool.query('Select * from notification where userId=?', userId, (err, row, field) => {
    if (err)
      console.log(err)
    if (row)
      res.status(200).send({ data: row })
  })
}

export const notificationRead = (req, res) => {
  pool.query('Update notification set open=1', (err, row, field) => {
    // console.log('in read');
    if (err)
      console.log(err)
    if (row) {
      console.log('in read');
      res.status(200).send({ message: 'done read' })
    }
  })
}

export const removeNotification = (req, res) => {
  const { id } = req.body
  pool.query('Delete from notification where id=?', id, (err, row, field) => {
    if (err)
      console.log(err)
    if (row)
      res.status(200).send({ message: 'deleted' })
  })
}
export const courseInfo = (req, res) => {
  const { courseId } = req.params
  pool.query('SELECT courses.id,courses.courseName,courses.courseDescription,user.fullName,user.email FROM courses INNER JOIN user ON courses.userId = user.id WHERE courses.id =?', courseId, (err, row, field) => {
    if (err)
      console.log(err)
    if (row)
      if (row.length === 0)
        res.status(200).send({ data: [] })
      else
        res.status(200).send({ data: row })

  })
}