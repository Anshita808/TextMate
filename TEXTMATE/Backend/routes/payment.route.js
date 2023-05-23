const express = require("express");
const app = express();
app.use(express.json())
// var mailgun = require('mailgun-js')({
//     apiKey:process.env.mailgun_api_key,
//     domain:process.env.mailgun_domain
// })
require("dotenv").config()

const paymentRouter = express.Router();
const { UserModel } = require("../models/user.model");



paymentRouter.get("/send_OTP", async (req,res)=>{

    try {
        emailInfo={
            from: 'TEXTMATE <binod@gmail.com>',
            to: 'binodokheda3@gmail.com',
            subject: 'Hello',
            text: 'Testing some Mailgun awesomeness!'
        }
    
        const send = await mailgun.messages().send(emailInfo)
        console.log(send)
        res.send({
            "msg": "email send successfully..."
          })
    } catch (error) {
        
        res.send(error.message)
    }
   
})


paymentRouter.post("/verify_OTP",async (req,res)=>{



})



module.exports={

    paymentRouter
}