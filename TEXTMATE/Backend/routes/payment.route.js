const express = require("express");
const app = express();
app.use(express.json())

require("dotenv").config()

const paymentRouter = express.Router();
const { UserModel } = require("../models/user.model");






paymentRouter.post("/verify_OTP",async (req,res)=>{



})



module.exports={

    paymentRouter
}