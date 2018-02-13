/**
 * RestaurantController
 *
 * @description :: Server-side logic for managing restaurants
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: (req, res) => {
		const inputs = req.allParams();
		console.log(req.user);
		Restaurant.create(inputs)
		.then(restaurant => {
			console.log('restaurant',restaurant)
			return User.find(req.user.id)
		.then(user => {
			console.log('user', user);
			restaurant.owners.add(req.user);
			return restaurant.save();
		})
		})
		.then(updated =>{
			console.log('here', updated)
			return res.json('success');
		})
		.catch(err => console.error(err));
	},

	index: (req, res) => {
		Restaurant.find({ owners: req.user }).populate('tags').populate('menus').populate('owners').then(restaurants => {
			return res.view('user/restaurant', { layout: 'user/layout', restaurants });
		});
	}
};

