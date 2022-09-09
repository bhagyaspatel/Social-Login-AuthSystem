const router = require('express').Router();
const passport = require('passport'); //REMEMBER : passport is a middleware

router.get('/login', (req, res) => {
	res.render('login');
});

router.get('/logout', (req, res) => {
	req.logout(); //property given by passport : alters (not delete, policy of passport) the token saved
	res.redirect('/auth/login');
});

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }), (req, res) => {
	res.send('login with google');
});

router.get('/google/callback', passport.authenticate('google'), (req, res) => {
	res.send(req.user); //this req.user property is injected by passport 
});

module.exports = router;