import { pool } from '../index.js';

export const updateUser = (req, res) => {
    const { fullName, phoneNumber, userAddress, userImg } = req.body;
    const { id } = req.body;

    pool.query("update user set fullName=?,phoneNumber=?,userAddress=?,userImg=? where id=?", [fullName, phoneNumber, userAddress, userImg, req.user.userId], (err, row, field) => {
        if (err) {
            console.log(err)
            res.status(500).send({ message: "cannot update user" });
            return
        }
        res.status(200).send({ id: id, message: "user updated Successfully" });
    })
}


export const getUser = (req, res) => {
    const { userId } = req.user;
    pool.query("select * from user where id=?", userId, (err, row, field) => {
        if (err) res.status(400).send("User doesnot exists");
        res.status(200).send({
            msg: 'User data',
            user: row[0],
        });
    })
}