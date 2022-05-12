import express from "express";
const router=express.Router();

import { login, SignUp, EmailVerify } from "../Controllers/Auth.js"; 

router.post ("/login",login);
router.post ("/signup",SignUp);
router.post ("/verifyEmail",EmailVerify);

export default router;