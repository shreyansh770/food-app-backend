const express = require('express');

const userRouter = express.Router();
const userModel = require('../models/userModel');
const {
    protectRoute,
    bodyChecker,
    isAuthorized
} = require('./authHelper')

const {createElement , deleteElement ,getElement , getElements,updateElement } = require("../helpers/factory")


userRouter.use(protectRoute) // middleware ki trah

const getUser = getElement(userModel)
const getUsers = getElements(userModel)
const updateUser = updateElement(userModel)
const createUser  = createElement(userModel)
const deleteUser = deleteElement(userModel)




userRouter
    .route('/') //  base route ke bad '/' ye hoga 
    .get(protectRoute , isAuthorized(["admin" , "ce"]),getUsers)
    .post(bodyChecker,isAuthorized(["admin"]) ,createUser)
    


// param route
userRouter
    .route('/:id') //  base route ke bad /:id ye hoga
    .get(getUser)
    .patch(bodyChecker, isAuthorized(["admin" , "ce"]),updateUser)
    .delete(bodyChecker, isAuthorized(["admin"]),deleteUser);



// async function getUser(req, res) {
 
//     let {id} = req.params; //  ye id mongoDb deta hai

//     try {

//         let user = await userModel.findById(id);
//         res.status(200).json({
//             message : "User found",
//             user : user
//         })
        
//     } catch (error) {
//         res.status(500).json({
//             message : "Server error "
//         })
//     }


// }


// async function getUsers(req, res, next) {
//     try {
//         console.log('Get function');

//         let users = await userModel.find();
//         if (users) {
//             return res.json(users);
//         } else {

//             return res.json({
//                 message: "users not found"
//             })
//         }
//     } catch (error) {
//         console.log(error.message);
//         return res.json({
//             message: error.message
//         })
//     }



// }



// async function updateUser(req, res) {
     
//     let {id} = req.params;
//     try {

//         if(req.body.password || req.body.confirmPassword){
//             return res.json({
//                 message :"Cannot update this field"
//             })
//         }

//         let user = await userModel.findById(id);
//         if(user){

//            req.body.id = undefined; // id vali delete kr di

//            for(let key in req.body){
//                user[key] = req.body[key];
//            }

//            // yaha pe save krte tym validators/hooks mat chalao
//            await user.save({
//                validateBeforeSave:false
//            })

//             res.status(200).json({
//                 message : "User profile updated",
//                 user : user
//             })
//         }else{
//             res.status(401).json({
//                 message :"user not found"
//             })
//         }
//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({
//             message: "Server Error"
//         })
//     }
// }



 // only authorised to admin

// async function createUser(req, res) {

//     try {
//         let user = await userModel.create(req.body);

//         res.status(200).json({
//             user: user
//         })

//     } catch (error) {
//         console.log(error.message);
//         res.status(500).json({
//             message: "Server Error"
//         })
//     }

// }




// async function deleteUser(req, res) {
//     let {id} = req.params; //  ye id mongoDb deta hai
//     try {

//         let user = await userModel.findByIdAndDelete(id);
//         res.status(200).json({
//             message : "User successfully deleted",
//             user : user
//         })
        
//     } catch (error) {
//         res.status(500).json({
//             message : "Server error "
//         })
//     }
// }





module.exports = userRouter;