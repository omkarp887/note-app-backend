const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


function authenticator(req, res, next) {
    const token = req.headers.authorization
    jwt.verify(token, "omkar",(err, decode)=>{
        if(err) return res.send({
            message : "token is not valid please login",
            status : 2
        })
        if(decode){
            req.body.user = decode.userId
            next()
        }else{
            res.send({
                message : "token is not valid please login",
                status : 2
            })
        }
    })
}
module.exports = {authenticator};