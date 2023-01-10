const router = express.Router();
import express from 'express';
import cron from 'node-cron'
import { login, SignUp, EmailVerify, ForgotPassword, ForgotPasswordChange, isAuthorized } from '../Controllers/Auth.js';
import { CreateCourse, getCourseNames, getCourses, getCourseCategories, joinCourse, getJoinedCourses, CourseContent, getCourseContent, enrolledLength, courseSetting, updateSetting, deleteCourse, manageUsers, deleteUserFromCourse, blockUserFromCourse, unblockUserFromCourse, changeKey, getNotification, removeNotification, courseInfo, notificationRead } from '../Controllers/Course.js';
import { createPoolCategory, getPoolCategory, addQuestionToPool, deletQuestion, editQuestionToPool, getPoolQuestions2, deletePoolCategory, getPoolQuestions3 } from "../Controllers/Pools.js";
import { authenticateToken } from '../Controllers/AuthenticateToken.js';
import { getUser, updateUser } from "../Controllers/User.js";
import { refreshToken } from '../Controllers/AuthenticateToken.js';
import { addQuizResult, addToTabFocus, atempttedQuizQuestions, editQuiz, getAllQuizzes, getAtempttedQuizQuestions, getTabFocus, quiz, quizCancellResult, quizDelete, showQuizResult, QuizNotification, getAllResult } from '../Controllers/Quiz.js';
import { deleteAssignment, editAssignment, getAssignmentResult, getAssignments, getStudentResult, submitAssignment, updateAssignmentResult, uploadAssignment } from '../Controllers/Assignment.js';
import { Server } from "socket.io";

export const io = new Server({
  //We can reach this server only on localhost:3000
  cors: {
    origin: "http://localhost:3000"
  }
});

export let onlineUsers = []

const addNewUser = (userId, socketId) => {
  !onlineUsers.some(user => user.userId === userId) && onlineUsers.push({ userId, socketId })
}

const removeUser = (socketId) => {
  onlineUsers = onlineUsers.filter(user => user.socketId !== socketId)
}

export const getUsers = (userId) => {
  // console.log(onlineUsers)
  return onlineUsers.find(user => user.userId === userId)
}


io.on("connection", (socket) => {

  socket.on('newUser', (userId) => {
    addNewUser(userId, socket.id)
  })

  socket.on('SendNotification', ({ senderId, recieverId }) => {
    const reciever = getUsers(recieverId)
    io.to(reciever?.socketId).emit('getNotification', {
      senderId,
    })
  })

  socket.on('SendNotification2', ({ senderId, recieverId }) => {
    const reciever = getUsers(recieverId)
    io.to(reciever?.socketId).emit('getNotification2', {
      senderId,
    })
  })

  //disconnect function
  socket.on("disconnect", () => {
    removeUser(socket.id)
  })
});


io.listen(5001);


router.get('/', (req, res) => {
  console.log('Cookies: ', req.cookies)
  res.send({
    success: '1',
    message: 'This is api working',
  });
});

// CRON SCHEDULE
// cron.schedule('* * * * *', () => {
//   console.log('running');
// });

cron.schedule('* * * * *', () => {
  QuizNotification()
});

// AUTHENTICATION
router.get("/isAuthorized", authenticateToken, isAuthorized);
router.get("/refreshToken/:userId/:quizId", refreshToken);

// LOGIN
router.post('/login', login);
router.post('/signup', SignUp);
router.post('/emailVerification', EmailVerify);
router.post('/forgotPassword', ForgotPassword);
router.post('/forgotPasswordChange', ForgotPasswordChange);
router.post("/user", authenticateToken, updateUser);
router.get("/user", authenticateToken, getUser);

// COURSES
router.post('/courses', authenticateToken, CreateCourse);
router.get('/courses/:userId', authenticateToken, getCourses);
router.post("/joinCourse", authenticateToken, joinCourse);
router.get('/joinedcourses/:userId', authenticateToken, getJoinedCourses);
router.get('/getCourseName/:userId', authenticateToken, getCourseNames);
router.get('/getCourseCategories/:courseId', authenticateToken, getCourseCategories);
router.post('/courseContent', authenticateToken, CourseContent)
router.get('/courseContent/:courseId', authenticateToken, getCourseContent)
router.get('/courseSetting/:courseId', authenticateToken, courseSetting)
router.post('/updateSetting', authenticateToken, updateSetting)
router.post('/deleteCourse', authenticateToken, deleteCourse)
router.post('/manageUsers', authenticateToken, manageUsers)
router.post('/deleteUserFromCourse', authenticateToken, deleteUserFromCourse)
router.post('/blockUserFromCourse', authenticateToken, blockUserFromCourse)
router.post('/unblockUserFromCourse', authenticateToken, unblockUserFromCourse)
router.get('/enrolledLength/:courseId', authenticateToken, enrolledLength)
router.get('/courseInfo/:courseId', authenticateToken, courseInfo)

// POOLS
router.post("/poolCategory", authenticateToken, createPoolCategory);
router.get("/poolCategory/:courseId/:userId", authenticateToken, getPoolCategory);
router.post("/editQuestionToPool", authenticateToken, editQuestionToPool);
router.post("/poolQuestions", authenticateToken, addQuestionToPool);
router.get("/poolQuestions2/:poolCategoryId/:courseId", authenticateToken, getPoolQuestions2);
router.get("/poolQuestions3/:userId/:courseId", authenticateToken, getPoolQuestions3);
router.post("/deletepoolQuestions", authenticateToken, deletQuestion);
router.post("/deletePoolCategory", authenticateToken, deletePoolCategory);

// QUIZ
router.post('/quiz', authenticateToken, quiz)
router.post('/editQuiz', authenticateToken, editQuiz)
router.post('/quizDelete', authenticateToken, quizDelete)
router.get("/getAllQuizzes/:courseId", authenticateToken, getAllQuizzes);
router.get("/getAllResult/:quizId/:courseId/:quizPoints/:totalQuestions", authenticateToken, getAllResult);
router.post("/atempttedQuizQuestions", authenticateToken, atempttedQuizQuestions)
router.get("/getAtempttedQuizQuestions/:userId/:quizId", authenticateToken, getAtempttedQuizQuestions)
router.post("/addQuizResult", authenticateToken, addQuizResult)
router.post("/changeKey", authenticateToken, changeKey)
router.get('/showQuizResult/:userId/:quizId', authenticateToken, showQuizResult)
router.get('/getTabFocus/:userId/:quizId', authenticateToken, getTabFocus)
router.post('/addToTabFocus', authenticateToken, addToTabFocus)
router.post('/quizCancellResult', authenticateToken, quizCancellResult)

// NOTIFICATION
router.get('/getNotification/:userId', authenticateToken, getNotification)
router.post('/removeNotification', authenticateToken, removeNotification)
router.post('/notificationRead', notificationRead)

// ASSIGNMENTS
router.post('/uploadAssignment', authenticateToken, uploadAssignment)
router.post('/editAssignment', authenticateToken, editAssignment)
router.post('/submitAssignment', authenticateToken, submitAssignment)
router.post('/updateAssignmentResult', authenticateToken, updateAssignmentResult)
router.get('/getAssignments/:courseId/:userId', authenticateToken, getAssignments)
router.get('/deleteAssignment/:id', authenticateToken, deleteAssignment)
router.get('/getAssignmentResult/:id', authenticateToken, getAssignmentResult)
router.get('/getStudentResult/:userId/:assignmentId', authenticateToken, getStudentResult)

export default router;

