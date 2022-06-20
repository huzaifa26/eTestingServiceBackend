import dotenv from 'dotenv';
import { pool } from '../index.js';

export const updateUser=(req,res)=>{
    const {fullName,phoneNumber,userAddress,userImg}=req.body;

    pool.query("update user set fullName=?,phoneNumber=?,userAddress=?,userImg=? where id=?",[fullName,phoneNumber,userAddress,userImg,req.user.userId],(err,row,field)=>{
        if(err){
            console.log(err)
            res.status(401).json("cannot update user");
            return
        }
        console.log(row);
        res.status(200).json("user updated Successfully");
    })
}