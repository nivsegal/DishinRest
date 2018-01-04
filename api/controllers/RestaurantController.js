/**
 * RestaurantController
 *
 * @description :: Server-side logic for managing restaurants
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	// create: (req, res) => {
	// 	const inputs = req.allParams();
	// 	Restaurant.createRest(inputs, (err, restaurant) => {
	// 		res.ok(restaurant);
	// 	});
	// }

	index: (req, res) => {
		Restaurant.find().populate('tags').populate('menus').then(restaurants => {
			return res.view('user/restaurant', { layout: 'user/layout', restaurants });
		});
	}
};

