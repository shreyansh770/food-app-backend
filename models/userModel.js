const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const {db_link} = process.env || require('../secrets')

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
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true // validation
    },

    email: {
        type: String,
        required: true,
        unique: true,
        validate:function(){
            // console.log(this);
            return validator.validate(this.email); // email-validator 
        }
    },

    createdAt:{
        type:String
    },

    password: {
        type: String,
        min:8, // minLength
        required: true,

    },

    confirmPassword: {
        type: String,
        min:8,
        required: true,
        validate : function(){
            return this.password === this.confirmPassword
        }

    },

    resetToken: String,

    role:{
        type : String,
        enum : ["admin","ce","user"],
        default : "user"
    },

    bookings : {
        type :[mongoose.Schema.ObjectId],
        ref:"bookingModel"
    }
    


});

//save hone se phle ye chle
userSchema.pre('save',async function(next){

    const salt = await bcrypt.genSalt(10); //  more the salting rounds more time it will take to decrypt code

    this.password = await bcrypt.hash(this.password , salt) // encrpyting the password

    this.confirmPassword = undefined; // ye vali field db me nhi jaegi


    next()
})


userSchema.methods.resetHandler = async function (password, confirmPassword) {


    const salt = await bcrypt.genSalt(10); //  more the salting rounds more time it will take to decrypt code

    this.password = await bcrypt.hash(this.password , salt) // encrpyting the password

    // this.password = password;
    this.confirmPassword = confirmPassword;
    this.resetToken = undefined;
}


                                /*db me model ka name*/
const userModel = mongoose.model('userModel' , userSchema);


// (async function createUser(){
//     let user={
//         name:"Shrey",
//         age:20,
//         email:"xyz@gmail.com",
//         password:"12345678",
//         confirmPassword:"12345678"
//     }

//     // let userObj = await userModel.create(user);
//     console.log(userObj);
// })();


module.exports = userModel
