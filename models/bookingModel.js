const mongoose = require('mongoose');

const {
    db_link
} = process.env ||  require('../secrets')

const validator = require('email-validator')

// database se connect hone pe humko ek database milta hai
mongoose.connect(db_link).then((db) => {
        // console.log(db);
        console.log("DB CONNECTED");
    })
    .catch((err) => {
        console.log(err);
    })


const bookingSchema = new mongoose.Schema({

    user :{
        type : mongoose.Schema.ObjectId,
        required:true,
    },

    plan : {
        type : mongoose.Schema.ObjectId,
        required:true
    },

    bookedAt:{
        type:Date,
    },

    priceAtThatTime : {
        type : Number,
        required:true
    },

    status :{
        type:String,
        enum:["pending","failed","sucess"],
        required:true,
        default : "pending"
    }
})



const bookingModel = mongoose.model('bookingModel', bookingSchema);





module.exports = bookingModel