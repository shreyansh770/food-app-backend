const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

const {
    bodyChecker
} = require("./authHelper")
const authRouter = express.Router();
const sendMail = require('../nodemailer')
const sendToken = require("../helpers/sendFPmail")


authRouter
    .route('/signup')
    .post(setCreatedAt, signupUser)

authRouter
    .route('/forgetpassword')
    .post(bodyChecker, forgetPassword)


authRouter
    .route('/login')
    .post(loginUser)

authRouter
     .route('/resetPassword')
     .post(resetPassword)


function setCreatedAt(req, res, next) {

    let obj = req.body;
    let length = Object.keys(obj).length;
    if (length == 0) {
        return res.status(400).json({
            message: "Cannot Create User"
        })
    }
    req.body.createdAt = new Date().toISOString();
    next();

}



const userModel = require('../models/userModel');
const {
    JWT_KEY
} = process.env || require('../secrets');

async function signupUser(req, res) {


    try {
        let userObj = req.body

        // console.log('user',req.body);

        // user.push({email,name,pw})


        let user = await userModel.create(userObj);
        console.log(user);
        sendMail(user)
        res.json({
            message: "User signed up",
            user: userObj
        })

    } catch (error) {
        res.json({
            message: error.message,
        })
    }


}


async function loginUser(req, res) {

    // email and password

    try {
        if (req.body.email) {
            let user = await userModel.findOne({
                email: req.body.email
            });
            if (user) {

                let areEqual = await bcrypt.compare(req.body.password , user.password) // internal decryption to check
                if (areEqual) {

                    // res.cookie(name,token_no,noneditable)

                    let payload = user['_id']; // unique id

                    let token = jwt.sign({
                        id: payload
                    }, JWT_KEY);

                    // res.cookie('login','1234',{httpOnly:true})

                    res.cookie('login', token, {
                        httpOnly: true
                    })

                    return res.json({
                        message: "User logged in"
                    });
                } else {
                    return res.json({
                        message: "Email or Password is wrong"
                    });
                }
            } else {
                return res.json({
                    message: "Email or Password is wrong"
                });
            }
        } else {
            return res.json({
                message: "No user Found !!!"
            });
        }
    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }


}

async function forgetPassword(req, res) {

    try {

        let {
            email
        } = req.body;
        // search user from email

        let user = await userModel.findOne({
            email
        })

        if (user) {
            // create token(OTP)
            let resetToken =
                (Math.floor(Math.random() * 10000) + 10000)
                .toString().substring(1);

            // update the user with a new token

            await userModel.updateOne({email}, {resetToken}) //  updateOne humko user lake nhi deta

            let userWtoken = await userModel.findOne({
                email
            })

            // send email
            sendToken(userWtoken)

            res.status(200).json({
                message : "user token send to your email",
                user: userWtoken,
                resetToken:resetToken
            })

        } else {
            return res.json({
                message: "No user Found !!!"
            });
        }

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}


async function resetPassword(req, res) {
    // token,confirmPassword,password
  
    try {
        let { resetToken, confirmPassword, password } = req.body;
        let user = await userModel.findOne({ resetToken });
  
        if (user) {

            // await userModel.updateOne({ token }, {
            //     token: undefined,
            //     password: password,
            //     confirmPassword: confirmPassword,
            // },{runValidators:true} )

            // server

            user.resetHandler(password,confirmPassword);
            // database entry 
            await user.save();
            let newUser = await userModel.findOne({ email: user.email });

            

            res.status(200).json({
                message: "user token send to your email",
                user: newUser,
            })
        }else{
            res.status(401).json({
                message :"user not found"
            })
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message
        })
    }
}

module.exports = authRouter;