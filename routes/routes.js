import express from 'express';
const router = express.Router();

import {login,SignUp,EmailVerify,ForgotPassword,ForgotPasswordChange} from '../Controllers/Auth.js';
import { CreateCourse, getCourseNames, getCourses, getCourseCategories } from '../Controllers/Course.js';
import {createPoolCategory,getPoolCategory,addQuestionToPool,getPoolQuestions} from "../Controllers/Pools.js";
import { authenticateToken } from '../Controllers/AuthenticateToken.js';
import {updateUser} from "../Controllers/User.js";

router.get('/', (req, res) => {
  res.json({
    success: '1',
    message: 'This is api working',
  });
});

router.post('/login', login);
router.post('/signup', SignUp);
router.post('/emailVerification', EmailVerify);
router.post('/forgotPassword', ForgotPassword);
router.post('/forgotPasswordChange', ForgotPasswordChange);

router.post ("/user",authenticateToken,updateUser);

router.post('/courses', authenticateToken, CreateCourse);
router.get('/courses/:userId', authenticateToken, getCourses);
router.get('/getCourseName/:userId',getCourseNames);
router.get('/getCourseCategories/:courseId',getCourseCategories);

router.post("/poolCategory",createPoolCategory);
router.get("/poolCategory/:courseId/:userId",getPoolCategory);

router.post("/poolQuestions",addQuestionToPool)
router.get("/poolQuestions/:userId",getPoolQuestions)

export default router;
