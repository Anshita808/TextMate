const express = require("express");
const { UserModel } = require("../models/user.model");
const app = express();
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { Blacklist } = require("../models/blacklist.model");
app.use(express.json());
require("dotenv").config()
const session = require('express-session');
const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const userRouter = express.Router();


// app.use(session({
//     secret: process.env.SESSION_SECRET,
//     resave: false,
//     saveUninitialized: false,
//   }));

// app.use(passport.initialize());
// app.use(passport.session());

// GITHUB_CLIENT_ID = 45f1ae73c281b43ca8a8
// GITHUB_CLIENT_SECRET = 4fbaf6072fc8ac2166f4f4c095d700fc28ec3dcb
// GITHUB_CALLBACK_URL = http://localhost:8080/auth/github/callback
// SESSION_SECRET = your_session_secret

// passport.use(new GitHubStrategy({
//     clientID: `45f1ae73c281b43ca8a8`,
//     clientSecret: `4fbaf6072fc8ac2166f4f4c095d700fc28ec3dcb`,
//     callbackURL: `http://localhost:8080/auth/github/callback`,
//   }, (accessToken, refreshToken, profile, cb) => {
//     // This function is called when the user is authenticated
//     // You can use the `profile` object to create or update a user in your database
//     return cb(null, profile);
// }));


// passport.serializeUser((user, cb) => {
//     cb(null, user);
// });
  
// passport.deserializeUser((obj, cb) => {
//     cb(null, obj);
// });


// userRouter.get('/auth/github', passport.authenticate('github', {
//     scope: ['user:email'],
// }));


// userRouter.get('/auth/github/callback',
//   passport.authenticate('github', { failureRedirect: '/login' }),
//   (req, res) => {
//     // Successful authentication, redirect to home page.
//     res.redirect('/');
// });


// userRouter.get('/auth/github/callback', (req, res, next) => {
//     passport.authenticate('github', (err, user) => {
//       if (err) {
//         return next(err);
//       }
  
//       req.logIn(user, (err) => {
//         if (err) {
//           return next(err);
//         }
  
//         res.redirect('/');
//       });
//     })(req, res, next);
// });
  
// userRouter.get('/', (req, res) => {
//     if (req.isAuthenticated()) {
//       res.send(`Hello, ${req.user.displayName}!`);
//     } else {
//       res.send('Please log in first.');
//     }
// });





userRouter.post("/register",async (req,res)=>{

    try {
        const {name,email,password, plan} = req.body

        const isUserExist = await UserModel.findOne({email});
        console.log(isUserExist)
        if(isUserExist){
            return res.send({msg:"user already exist in the database try with new email"})
        }

        const hash = await bcrypt.hash(password,8)
        console.log(hash)
        const user = new UserModel({name,email,password:hash,plan})
        await user.save()

      res.send({msg:"user has been registered successfully"})
        
    } catch (error) {
        res.send({msg:error.msg})
    }
})

userRouter.post("/login",async (req,res)=>{

    try {
        const {email,password}= req.body
        const isUserExist = await UserModel.findOne({email})
       
        if(!isUserExist){

            return res.status(401).send({msg:"invalid username or password"})
        }

        var result=bcrypt.compareSync(password, isUserExist.password)

        if(!result){
            return res.status(401).send({msg:"invalid username or password"})
        }

        const Accesstoken = jwt.sign({userID:isUserExist._id},process.env.accesstoken)

        res.send({msg:"login successfull",user:isUserExist,Accesstoken})
    } catch (error) {
        res.send({msg:error.msg})
    }
})


userRouter.get("/logout",async (req,res)=>{
    // we wil get the accesstoken and refreshtoken in req.headers with the respective name;
        try {
            const accesstoken = req.headers.authorization
            
            const blackAccess = new Blacklist({token:accesstoken});
            await blackAccess.save()
    
            res.send({msg:"logout successfull....."})
    
        } catch (error) {
            res.send({msg:error.msg})
        }
    })


module.exports={
    userRouter
}