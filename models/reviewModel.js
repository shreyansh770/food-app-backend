const mongoose = require('mongoose');

const {
    db_link
} = process.env || require('../secrets')

const validator = require('email-validator')

// database se connect hone pe humko ek database milta hai
mongoose.connect(db_link).then((db) => {
        // console.log(db);
        console.log("DB CONNECTED");
    })
    .catch((err) => {
        console.log(err);
    })


const reviewSchema = new mongoose.Schema({

    review: {
        type: String,
        required: [true, "Review can't be empty"]
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, "Review must contain some rating"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        required: [true, "Review must belong to a user"],
        ref: "userModel"  //  is model ka ref  milega jisse hum
    },
    plan: {
        type: mongoose.Schema.ObjectId,
        ref: "planModel",
        required: [true, "Review must belong to a plan "]
    }




});



/*db me model ka name*/
const reviewModel = mongoose.model('reviewModel', reviewSchema);





module.exports = reviewModel