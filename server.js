const express = require('express'); 
const cookieParser = require('cookie-parser')// insecure i.e y we use jwt

const jwt = require('jsonwebtoken');


const rateLimit = require("express-rate-limit");
const hpp = require('hpp');
const xss = require('xss-clean')
const helmet = require("helmet");
const sanitize = require('mongo-sanitize');

const app = express(); //  server create

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // stopping that IP from sending request from sending more than max request in 15 mins otherwise blocking them for 15 mins
    max: 100, // limit each IP to 100 requests per windowMs
    message:
    "Too many request from this IP, please try again after 15 mins"
});


// applying limiter for every router -> we can also apply diffrent rate limiters to diffrent account (check docs)
app.use(limiter);

app.use(helmet())

app.use(express.json()) // express me jo bhi data a rha hai usko as json same interpret kro      

// invalid query
app.use(hpp({
    whitelist:[ //-> whitelisting the only queries allowed all other query will be blocked
        'select',
        'page',
        'sort',
        'myquery'
    ]
}))

// cross site scripting
app.use(xss())

// mongodb query sanitize
app.use(mongoSanitize())


app.use(cookieParser())
let port = '8081';

app.listen( process.env.PORT ||port,()=>{
    console.log(`Server is listening on port ${port}`);
})


app.use(express.static('public'));

// const userRouter= express.Router();

const userRouter = require("./Router/userRouter")

// const authRouter = express.Router();

const authRouter = require("./Router/authRouter")


const planRouter = require("./Router/planRouter");
const reviewRouter = require('./Router/reviewRouter');
const bookingRouter = require('./Router/bookingRouter');


/*MIDDLEWARE*/

// app.use((req,res,next)=>{
//     console.log('I am a middleware -1');
//     // if we are not sending any res from mw we have to call next so that it moves on to the next mw function
//     next(); 
// })



// isse agr koi hamre site pe a raha hai aur uska base route /user se match kr raha hai to vo userRouter pe chla jyega 

        /*base route*/
app.use('/user',userRouter) 

app.use('/auth',authRouter)

app.use('/plans' , planRouter)

app.use('/review' , reviewRouter)

app.use('/booking' , bookingRouter)

/*
    userRouter me baki ka route track krega
    aur /user ke bad ke route ko match krega
    and uske according jis type method call uske
    correspoding function chla dega
*/



/* yaha se code different Routers me daal di gayi hai */



//redirects
app.get('/user-all',(req,res)=>{
    res.redirect('/user') //  dobara server vali file chlti hai
})




// 404 error

// PUT THIS FUNCTION IN END
//BCOZ THIS SHOULD RUN ONLY WHEN NO OTHER FUNCTION OR METHOD RUNS

app.use((req,res)=>{
    res.json({
        message : "Page not found"
    })
})