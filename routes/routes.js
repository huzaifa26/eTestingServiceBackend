import express from 'express';
const router = express.Router();

import {
  login,
  SignUp,
  EmailVerify,
  // ForgotPassword,
} from '../Controllers/Auth.js';

router.post('/login', login);
router.post('/signup', SignUp);
router.post('/emailVerification', EmailVerify);
// router.post('/forgotpassword', ForgotPassword);
router.get('/restapi', (req, res) => {
  res.json({
    success: '1',
    message: 'This is api working',
  });
});

export default router;
