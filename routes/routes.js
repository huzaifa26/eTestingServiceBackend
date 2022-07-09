import express from 'express';
const router = express.Router();

import {login,SignUp,EmailVerify,ForgotPassword,ForgotPasswordChange, isAuthorized} from '../Controllers/Auth.js';
import { CreateCourse, getCourseNames, getCourses, getCourseCategories, joinCourse, getJoinedCourses } from '../Controllers/Course.js';
import {createPoolCategory,getPoolCategory,addQuestionToPool,getPoolQuestions,deletQuestion} from "../Controllers/Pools.js";
import { authenticateToken } from '../Controllers/AuthenticateToken.js';
import {getUser, updateUser} from "../Controllers/User.js";
import { refreshToken } from '../Controllers/AuthenticateToken.js';

router.get('/', (req, res) => {
  console.log('Cookies: ', req.cookies)
  res.json({
    success: '1',
    message: 'This is api working',
  });
});

router.post('/login', login);
router.post('/signup', SignUp);
router.post('/emailVerification', EmailVerify);
router.post('/forgotPassword', ForgotPassword);
router.post('/forgotPasswordChange',ForgotPasswordChange);

router.post ("/user",authenticateToken,updateUser);
router.get("/user",authenticateToken,getUser);

router.post('/courses', authenticateToken, CreateCourse);
router.get('/courses/:userId',authenticateToken, getCourses);
router.get('/joinedcourses/:userId',authenticateToken, getJoinedCourses);
router.get('/getCourseName/:userId',authenticateToken, getCourseNames);
router.get('/getCourseCategories/:courseId',authenticateToken, getCourseCategories);
router.post("/poolCategory",authenticateToken, createPoolCategory);
router.get("/poolCategory/:courseId/:userId",authenticateToken, getPoolCategory);
router.post("/poolQuestions",authenticateToken, addQuestionToPool);
router.get("/poolQuestions/:userId",authenticateToken, getPoolQuestions);

router.post("/deletepoolQuestions",authenticateToken, deletQuestion);


router.post("/joinCourse", joinCourse);

router.get("/isAuthorized",authenticateToken,isAuthorized);
router.get("/refreshToken",refreshToken);

export default router;
