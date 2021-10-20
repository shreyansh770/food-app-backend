const express = require('express'); 

const app = express(); //  server create

let port = '8080';

app.listen(port,()=>{
    console.log(`Server is listening on port ${port}`);
})


app.get('/',(req,res)=>{
    console.log(req);
    res.send('hello') ; 
    res.end() //  to stop server from sending further response
})

// let obj={
//     'name':'Shreynash'
// }

app.get("/home",(req,res)=>{
     
    // __dirname -> jaha pe hum hai vaha tak ka path hoga 
    res.sendFile('./views/index.html',{root:__dirname})
    
})