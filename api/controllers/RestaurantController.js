/**
 * RestaurantController
 *
 * @description :: Server-side logic for managing restaurants
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: (req, res) => {
		const inputs = req.allParams();
		Restaurant.create(inputs)
			.then(restaurant => {
				return User.find(req.user.id)
					.then(user => {
						restaurant.owners.add(req.user);
						return restaurant.save();
					})
			})
			.then(updated => {
				return res.json('success');
			})
			.catch(err => console.error(err));
	},

	index: (req, res) => {
		Restaurant.find().populate('tags').populate('menus').populate('owners', { id: req.user.id }).then(restaurants => {
			return res.view('user/restaurant', { layout: 'user/layout', restaurants });
		});
	}
};

