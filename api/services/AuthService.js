
var passport = require('passport');

module.exports = {
	loginCallBack: (vendor, ...args) => {
		passport.authenticate(vendor, {
			successRedirect: '/',
			failureRedirect: '/fail'
		})(...args);
	},
};