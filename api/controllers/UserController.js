/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  /**
   * `UserController.login()`
   */
	login: (req, res) => {
		return res.login({
			successRedirect: '/'
		});
	},


  /**
   * `UserController.logout()`
   */
	logout: (req, res) => {
		req.logout();
		return res.ok('Logged out successfully.');
	},


  /**
   * `UserController.signup()`
   */
	signup: (req, res) => {
		const params = req.params.all();
		User.create(params).then(user => {
			req.logIn(user => {
				return res.redirect('/welcome');
			});
		}).catch(err => {
			console.log(err);
		});
	}
};

