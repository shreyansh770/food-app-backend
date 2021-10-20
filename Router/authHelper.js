const jwt=require('jsonwebtoken');
const { JWT_KEY } = require("../secrets")
const userModel = require('../models/userModel');


module.exports.protectRoute = 
function protectRoute(req, res, next) {

    try {

        if (req.cookies.login) {
            console.log("12" ,req.cookies);
            let isVerified = jwt.verify(req.cookies.login,JWT_KEY)
            // if(req.cookies.login === '1234'){
            if(isVerified){
                let userId = isVerified.id;
                req.userId = userId;
                next()
            }else{
                return res.json({
                    message:"Not Authorized"
                })
            }
            
        } else {

            res.json({
                message: "operation not allowed"
            })

        }

    } catch (error) {
        res.status(500).send({
            message: "Server Error"
        })
    }

}


module.exports.bodyChecker = 
function bodyChecker(req, res, next) {
    console.log("reached body checker");
    let isPresent = Object.keys(req.body).length;
    //console.log("ispresent", isPresent)
    if (isPresent) {
        next();
    } else {
        res.send("kind send details in body ");
    }
}


module.exports.isAuthorized = 
function isAuthorized(roles){
       
    return async function(req,res,next){
        // id ->get user->get role
        // check if role is allowed for the following role
        let {userId} = req;
        try {
            let user = await userModel.findById(userId);
            let userisAuthorized = roles.includes(user.role);
            if(userisAuthorized){
                next();
            }else{
                res.status(401).json({
                    message : "You are not authorized"
                })
            }
        } catch (error) {
            console.log(error.message);
            res.status(500).json({
                message : "Server Error"
            })
        }


    }
}