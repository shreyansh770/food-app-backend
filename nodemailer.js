const nodemailer = require('nodemailer');
const {nodemailer_pass} = process.env ||require("./secrets")
// userObj -> name , email ,password


module.exports = async function sendMail(userObj) {

  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587, // free protocol
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'shreyanshthakur1@gmail.com', // generated ethereal user
      pass: nodemailer_pass, // generated ethereal password
    },
  });

  var Osubject, Otext, Ohtml;

  Osubject = `Thank You for signing ${userObj.name}`;

  Otext = `
     Hope You are having a good day!
     Here are your details -
     Name - ${userObj.name}
     Email - ${userObj.email}
  `

  Ohtml = `<h1>Welcome To foodApp.com</h1>`

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Food App 😋" <shreyanshthakur1@gmail.com>', // sender address
    to: userObj.email, // list of receivers
    subject: Osubject, // Subject line
    text: Otext, // plain text body
    html: Ohtml, // html body
  });

   // jb email success hota hai to email ki id info me ati hai
  console.log("->" , info.messageId)

}


// sendMail().catch(console.error);