import dotenv from 'dotenv';
import { pool } from '../index.js';

export const updateUser=(req,res)=>{
    const {fullName,phoneNumber,userAddress,userImg}=req.body;

    pool.query("update user set fullName=?,phoneNumber=?,userAddress=?,userImg=? where id=?",[fullName,phoneNumber,userAddress,userImg,req.user.userId],(err,row,field)=>{
        if(err){
            console.log(err)
            res.status(500).json("cannot update user");
            return
        }
        console.log(row);
        res.status(200).json("user updated Successfully");
    })
}

export const getUser = (req,res)=>{
    const {userId} = req.user;
    console.log(userId);
    pool.query("select * from user where id=?",userId,(err,row,field)=>{
        if (err) res.status(400).json("User doesnot exists");
        console.log(row);
        res.status(200).json({
            msg: 'User data',
            user: row[0],
          });
    })
}