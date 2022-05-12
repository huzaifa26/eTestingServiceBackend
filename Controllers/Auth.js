import { pool } from "../index.js";

export const login=(req,res,next)=>{
    const {email,password}=req.body;

    pool.query("SELECT * FROM user where email=? and pass=? and verified = 1",[email,password], function(err, rows, fields) {
        if(err !== null){
            console.log(err)
            res.status(400).json(err);
            return
        }
        console.log(rows)
        if(rows.length === 0){
            res.status(401).json("Unauthorized Access, Verify email address.");
            return
        }
        res.status(200).json(rows[0]);
    })
}

export const SignUp=(req,res,next)=>{
    const {fullName,email,password}=req.body;
    pool.query("insert into user (fullName,email,pass) values (?,?,?);",[fullName,email,password],(err,rows, fields)=>{
        if(err !== null){
            console.log(err)
            res.status(400).send(err);
            return
        }
        res.status(200).json({
            id:rows.insertId,
            fullName:fullName,
            email:email
        });
    })
}

export const EmailVerify=(req,res,next)=>{
    const {id}=req.body;
    console.log(id)

    pool.query("UPDATE user set verified = true where id=?",id,(err,rows,fields)=>{
        if(err !== null){
            console.log(err)
            res.status(400).send(err);
            return
        }
        res.status(200).json("Success");
    })
}