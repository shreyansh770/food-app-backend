const express = require("express");

const reviewRouter = express.Router();

const reviewModel = require("../models/reviewModel")
const planModel = require("../models/planModel")

const {
    protectRoute,
    bodyChecker,
    isAuthorized
} = require('./authHelper')
const {
    getElement,
    getElements,
    updateElement
} = require("../helpers/factory")



const updatereview = updateElement(reviewModel)
const getreviews = getElements(reviewModel)
const getReview = getElement(reviewModel)


reviewRouter.use(protectRoute);

// reviewRouter
//           .route("/getuseralso")
//           .get(getUsersAlso);




const createReview = async function (req, res) {
    try {

        let review = await reviewModel.create(req.body);

        console.log(review);
        let planId = review.plan;


        let plan = await planModel.findById(planId);
        plan.reviews.push(review['_id']);

        if(plan.averageRating){
            let sum = plan.averageRating * plan.reviews.length;
            let finalAvgRating = (sum + review.rating) / (plan.reviews.length +1);
            plan.averageRating = finalAvgRating;
        }else{
            plan.averageRating = review,rating; //  first rating jab mil rahi hai
        }

        res.status(200).json({
            message:"Review Given",
            review : review
        })

    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}



const deleteReview = async function (req, res) {
    try {
        let review = await reviewModel.findByIdAndDelete(req.body.id);
        console.log("review", review);
        let planId = review.plan;
        let plan = await planModel.findById(planId);
        let idxOfReview = plan.reviews.indexOf(review["_id"]);
        plan.review.splice(idxOfReview, 1);
        await plan.save();
        res.status(200).json({
            message: "review deleted",
            review: review
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
};



// async function getUsersAlso(req, res) {
//     try {
//         let reviews = await reviewModel.find().populate({
//             path: "user plan",
//             select: "name email duration"
//         })
//         res.json({
//             reviews
//         })
//     } catch (err) {
//         console.error("59" , err);
//         res.status(500).json({
//             message: "server error"
//         })
//     }
// }


reviewRouter
    .route('/') //  base route ke bad '/' ye hoga 
    .get(protectRoute, isAuthorized(["admin", "ce"]), getreviews)
    .post(bodyChecker, isAuthorized(["admin"]), createReview)



// param route
reviewRouter
    .route('/:id') //  base route ke bad /:id ye hoga
    .get(getReview)
    .patch(bodyChecker, isAuthorized(["admin", "ce"]), updatereview)
    .delete(bodyChecker, isAuthorized(["admin"]), deleteReview);



module.exports = reviewRouter