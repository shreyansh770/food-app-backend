const express = require("express");

const bookingRouter = express.Router();

const bookingModel = require("../models/bookingModel")
const userModel = require("../models/bookingModel")
const Razorpay = require("razorpay")
const {KEY_ID , KEY_SECRETS} = require('../secrets')

var razorpay = new Razorpay({
    key_id:KEY_ID,
    key_secret: KEY_SECRETS,
  });

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



const updatebooking = updateElement(bookingModel)
const getbookings = getElements(bookingModel)
const getbooking = getElement(bookingModel)


bookingRouter.use(protectRoute);


//razorpay payment ke corresponding batata hai ki payment request is legit ot not
// iske liye razorpay ke webhook setup me pay.captured ke sath /verification route define krna hota hai


/*async function verifyPayment(req,res){
    const secret = KEY_SECRETS;
  
    console.log(req.body);
  
    const shasum = crypto.createHmac("sha256", secret);
    shasum.update(JSON.stringify(req.body));
    const digest = shasum.digest("hex");
  
    console.log(digest, req.headers["x-razorpay-signature"]);
  
    if (digest === req.headers["x-razorpay-signature"]) {
      console.log("request is legit");
      res.status(200).json({
        message: "OK",
      });
    } else {
      res.status(403).json({ message: "Invalid" });
    }
}*/



const initiateBooking = async function (req, res) {
    try {


        let booking = await bookingModel.create(req.body);

        let bookingId = booking["_id"];
        let userId = req.body.user

        let user = await userModel.findById(userId);

        user.bookings.push(bookingId)

        await user.save()

       // RAZORPAY

        const payment_capture = 1;
        const amount = 500;
        const currency = "INR";

        const options = {
            amount,
            currency,
            receipt: `rs_${bookingId}`,
            payment_capture,
        };


        const response = await razorpay.orders.create(options);
        console.log(response);
        res.status(200).json({
            id: response.id,
            currency: response.currency,
            amount: response.amount,
            message: "Booking created",
            booking: booking
        });


    } catch (error) {
        res.status(500).json({
            message: "Server Error"
        })
    }
}



const deletebooking = async function (req, res) {
    try {
        let booking = await bookingModel.findByIdAndDelete(req.body.id);
        console.log("booking", booking);
        let userId = booking.user;
        let user = await userModel.findById(userId);
        let idxOfbooking = user.bookings.indexOf(booking["_id"]);
        user.booking.splice(idxOfbooking, 1);
        await user.save();
        res.status(200).json({
            message: "booking deleted",
            booking: booking
        })
    } catch (err) {
        res.status(500).json({
            message: err.message
        })
    }
};


//bookingRouter.route("/verification").post(verifyPayment)


bookingRouter
    .route('/') //  base route ke bad '/' ye hoga 
    .get(protectRoute, isAuthorized(["admin", "ce"]), getbookings)
    // create -> when payment has been done
    .post(bodyChecker, isAuthorized(["admin"]), initiateBooking)



// param route
bookingRouter
    .route('/:id') //  base route ke bad /:id ye hoga
    .get(getbooking)
    .patch(bodyChecker, isAuthorized(["admin", "ce"]), updatebooking)
    .delete(bodyChecker, isAuthorized(["admin"]), deletebooking);



module.exports = bookingRouter