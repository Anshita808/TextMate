const {UserModel}=require("../models/user.model");
require("dotenv").config()
const bcrypt= require("bcrypt")
const passport = require("passport")

const mongoose = require("mongoose")
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
passport.serializeUser((user, done) => {
	// console.log(user);
	done(null, user.email);
});

passport.deserializeUser(async (email, done) => {
	const user = await UserModel.findOne({ email: email });
	done(null, user);
});
passport.use(
	new GoogleStrategy(
		{
			clientID:process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: "http://localhost:8080/auth/google/callback",
			passReqToCallback: true,
		},
		// async (accessToken, refreshToken, profile, done) => {
		// 	// Check if the user already exists in the database

		// 	console.log(profile);
		// 	const existingUser = await UserModel.findOne({ googleId: profile.id });
		// 	if (existingUser) {
		// 		console.log("User found:", existingUser);
		// 		return done(null, existingUser);
		// 	}

		// 	// Create a new user if the user does not exist
		// 	const newUser = await UserModel.create({ googleId: profile.id });
		// 	console.log("New user created:", newUser);
		// 	return done(null, newUser);
		// }

		async (request, accessToken, refreshToken, profile, done) => {
			//Register user here
			// console.log(request);
			done(null, profile);

			const cUser = await UserModel.findOne({ email: profile.email });
			// console.log("current user :", cUser);
			const hashedPassword = bcrypt.hashSync(profile.id,5)
			if (!cUser) {
				const newUser = {
					email: profile.email,
					name: `${profile.name.givenName} ${profile.name.familyName}`,
					password: hashedPassword,
				};

				// bcrypt.hash(password, 5, async (err, hash) => {
				// 	const newUser = UserModel({ email :profile.email, name: profile.name, password: hash, role });
				// 	await newUser.save();
				// 	res.status(200).send({ msg: "Registration Successful" });
				// });

				const data = new UserModel(newUser);
				// console.log("New user created:", newUser);
				await data.save()
				// request.body = newUser;
				return done(null, newUser);
			} else {
				request.body = cUser;
			}
		}
	)
);

const googleAuthentication = async (req, res) => {

  // Successful authentication, redirect home.

  // console.log(req.user)

  const user = req.user
//   console.log(user)
  const getUser = await UserModel.findOne({email:user.email})
	const forLocal = {
		name : getUser.name,
		email : getUser.email,
		id : getUser._id
	}

  // let token = jwt.sign({ UserID: user._id}, process.env.SecretKey, { expiresIn: "24h" })

  // const frontendURL = `https://qr-insight-craft.netlify.app/`

  const frontendURL = "http://127.0.0.1:5500/slim-pies-222/TEXTMATE/Frontend/index.html"

  res.send(`
              <a href="${frontendURL}?userID=${getUser._id}" id="myid" style="display: flex; justify-content: center; align-items: center; height: 100vh; background-color: #222222; margin: 0; padding: 0; overflow: scroll;">
                  <img style="width:100%;" src="https://cdn.dribbble.com/users/1787505/screenshots/7300251/media/a351d9e0236c03a539181b95faced9e0.gif" alt="https://i.pinimg.com/originals/c7/e1/b7/c7e1b7b5753737039e1bdbda578132b8.gif">
              </a>
              <script>
                  let a = document.getElementById('myid')
				 
                  setTimeout(()=>{
                      a.click()
                  },2000)
                  console.log(a)
				  
              </script>
      `)

}


  module.exports={passport,googleAuthentication}