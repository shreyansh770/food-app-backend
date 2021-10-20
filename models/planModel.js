const mongoose = require('mongoose');

const {db_link} = require('../secrets')

const validator = require('email-validator')

// database se connect hone pe humko ek database milta hai
mongoose.connect(db_link).then((db) => {
        // console.log(db);
        console.log("DB CONNECTED");
    })
    .catch((err) => {
        console.log(err);
    })


    // Schema
const planSchema = new mongoose.Schema({

    name : {
        type :String,
        required :[true ,"Kindly enter plan name"],
        unique : [true , "plan name should be unique"],
        maxlength :[40 , "Your plan name is more than 40 characters"]
    },

    duration :{
        type:Number,
        required : [true , "You need to provide duration"]
    },

    price :{
        type : Number,
        required :true,
    },

    discount : {
        type : Number,
        validate :{
            validator : function(){
                return this.discount < this.price
            }
        },

        messsage : "Discount must be less than actual price"
    },

    planImages : {
        type : [String]
    },

    reviews :{
 
        type : [mongoose.Schema.ObjectId],
        ref : 'reviewModel'
    },

    averageRating :Number
    


});

                                /*db me model ka name*/
const planModel = mongoose.model('planModel' , planSchema);





module.exports = planModel
