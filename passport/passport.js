const passport = require('passport');
const User = require('../models/user');

var GoogleStrategy = require('passport-google-oauth20').Strategy;

//from : https://www.passportjs.org/concepts/authentication/downloads/html/
//this same as we used to create token store it in cookies and use to check everytime during login
passport.serializeUser(function (user, done) {
	process.nextTick(function () {
		return done(null, {
			id: user.id,
			username: user.username,
			picture: user.picture
		});
	});
});

passport.deserializeUser(function (user, done) {
	process.nextTick(function () {
		return done(null, user);
	});
});


//from JSON file downloaded from cosole.cloud.google.com
passport.use(new GoogleStrategy({
	clientID: "954101893517-nub2sfn27bhk4g4m8t5ltefaurt1dkq3.apps.googleusercontent.com",
	clientSecret: "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",
	callbackURL: "http://localhost:4000/auth/google/callback"
}, (accessToken, refreshToken, profile, next) => {
	//callback
	console.log('MY profile', profile);
	console.log('MY profile', profile._json.email);

	User.findOne({ email: profile._json.email })
		.then(user => {
			if (user) {
				console.log('User already exist in DB', user);
				//cookieToken() : as done in Ecomm app before
				next(null, user); //this next is of passport nothing to do with passport
			} else {
				User.create({
					name: profile.displayName,
					googleId: profile.id,
					email: profile._json.email
				})
					.then(user => {
						console.log("new user", user);
						//cookieToken() : as done in Ecomm app before
						next(null, user);
					})
					.catch((error) => console.log(error));
			}
		})
		.catch((error) => {

		});

	// next();
}));