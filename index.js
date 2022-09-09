const express = require('express');
const mongoose = require('mongoose');
const auth = require('./routes/auth');
const passportConfig = require('./passport/passport');
const passport = require('passport');
const cookieSession = require('cookie-session');
const app = express();

//connect to DB
mongoose.connect('mongodb://127.0.0.1:27017/passport', () => {
	console.log(`DB CONNECTED`);
});

app.use(cookieSession({
	maxAge: 3 * 24 * 60 * 60 * 1000,
	keys: ['thisislcotokenkey'], //dotenv 
}));

app.use(passport.initialize());
app.use(passport.session());

//middleware
const isLoggedIn = (req, res, next) => {
	//if all serialization, token creation etc works fine req.user will be present otherwise not
	if (!req.user) {
		res.redirect('/auth/login');
	}
	next();
};

app.set('view engine', 'ejs');

app.use('/auth', auth);

// using isLoggedIn middleware which protects User route
app.get('/', isLoggedIn, (req, res) => {
	res.render("home");
});


app.listen(4000, () => {
	console.log(`Server is running at port 4000...`);
});