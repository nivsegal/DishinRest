/**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var passport = require('passport');

var AuthController = {

	_config: {
		actions: false,
		shortcuts: false,
		rest: false
	},

	// Here is where we specify our facebook strategy.
	// https://developers.facebook.com/docs/
	// https://developers.facebook.com/docs/reference/login/
	facebook: (req, res, next) => {
		const args = [req, res, next];
		passport.authenticate('facebook', { failureRedirect: '/', scope: ['email'], callbackURL: '/auth/facebook/callback' }, (err, user) => {
			AuthController.processLogin(user, err, ...args);
		})(req, res, next);
	},
	// https://developers.google.com/
	// https://developers.google.com/accounts/docs/OAuth2Login#scope-param
	google: (req, res, next) => {
		passport.authenticate('google', {
			failureRedirect: '/',
			scope: ['https://www.googleapis.com/auth/plus.login',
				'https://www.googleapis.com/auth/plus.profile.emails.read']
		}, (err, user) => {
			AuthController.processLogin(user, err, ...args);
		})(req, res, next);
	},

	instagram: (req, res, next) => {
		passport.authenticate('instagram', {
			failureRedirect: '/',
			scope: ['public_content']
		}, (err, user) => {
			AuthController.processLogin(user, err, ...args);
		})(req, res, next);
	},

	twitter: (req, res, next) => {
		passport.authenticate('twitter', {
			failureRedirect: '/'
		}, (err, user) => {
			AuthController.processLogin(user, err, ...args);
		})(req, res, next);
	},

	googleCallback: (req, res, next) => {
		AuthService.loginCallBack('google', req, res, next);
	},

	facebookCallback: (req, res, next) => {
		AuthService.loginCallBack('facebook', req, res, next);
	},

	instagramCallback: (req, res, next) => {
		AuthService.loginCallBack('instagram', req, res, next);
	},

	twitterCallback: (req, res, next) => {
		AuthService.loginCallBack('twitter', req, res, next);
	},

	logout: (req, res) => {
		req.logout();
		res.redirect('/');
	},

	processLogin: (user, err, ...args) => {
		// console.log(args);
		const req = args[0];
		const res = args[1];
		req.logIn(user, err => {
			if (err) {
				console.log(err);
				res.view('500');
				return;
			}
			console.log(user);
			res.redirect('/');
			return;
		});
	},


	login: (req, res, next) => {
		passport.authenticate('local', (err, user) => {
			AuthController.processLogin(user, err, req, res);
		})(req, res, next);
	},


};
module.exports = AuthController;

