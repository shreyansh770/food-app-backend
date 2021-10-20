const express = require("express");

const planRouter = express.Router();

const planModel = require("../models/planModel")

const {
    protectRoute,
    bodyChecker,
    isAuthorized
} = require('./authHelper')
const {
    createElement,
    deleteElement,
    getElement,
    getElements,
    updateElement
} = require("../helpers/factory")





planRouter.use(protectRoute);

const deletePlan = deleteElement(planModel)
const createPlan = createElement(planModel)
const updatePlan = updateElement(planModel)
const getPlans = getElements(planModel)
const getPlan = getElement(planModel)

planRouter
    .route('/') //  base route ke bad '/' ye hoga 
    .get(protectRoute, isAuthorized(["admin", "ce"]), getPlans)
    .post(bodyChecker, isAuthorized(["admin"]), createPlan)


planRouter.route("/sortByRating").get(getBestPlans);


// param route
planRouter
    .route('/:id') //  base route ke bad /:id ye hoga
    .get(getPlan)
    .patch(bodyChecker, isAuthorized(["admin", "ce"]), updatePlan)
    .delete(bodyChecker, isAuthorized(["admin"]), deletePlan);



/****************************************** */

async function getBestPlans(req, res) {
    console.log("hello")
    try {

        let plans = await planModel.find()
            .sort("-averageRating").populate({
                path: 'reviews', // kisko populate krna hai
                select: "review" // kisse populate krna hai
            })
        console.log(plans);
        res.status(200).json({
            plans
        })
    } catch (err) {
        console.log(err);
        res.status(200).json({
            message: err.message
        })
    }
}


module.exports = planRouter;