/**
 * RestaurantController
 *
 * @description :: Server-side logic for managing restaurants
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	create: async (req, res) => {
		const inputs = req.allParams();
		const restaurant = await Restaurant.create(inputs);
		await Restaurant.addToCollection(restaurant.id, 'owners').members([req.user.id]);
		return res.json('success');
	},

	index: async(req, res) => {
		// console.log(req.user)
		// Restaurant.find().populate('tags').populate('menus').populate('owners').then(restaurants => {
		// 	return res.view('user/restaurant', { layout: 'user/layout', restaurants });
		// });
		// User.findOne(req.user.id).populate('restaurants').then(data => { //get the user's restaurant
		// 	if(data.restaurants.length === 0) {
		// 		return res.view('user/restaurant', { layout: 'user/layout', user: req.user, restaurant: null });
		// 	}
		// 	Restaurant.findOne(data.restaurants[0].id).populate('menus').populate('tags').then(restaurant => {
		// 		return res.view('user/restaurant', { layout: 'user/layout', user: req.user, restaurant });
		// 	});
		// }).catch(err => {
		// 	console.log(err);
		// })
		try {
			const user = await User.findOne(req.user.id).populate('restaurants');
			if(user.restaurants.length === 0) {
				return res.view('user/restaurant', { layout: 'user/layout', user: req.user, restaurant: null });
			} else {
				const restaurant = await Restaurant.findOne(user.restaurants[0].id).populate('menus').populate('tags').populate('menuItems');
				return res.view('user/restaurant', { layout: 'user/layout', user: req.user, restaurant });
			}
		} catch (err) {
			console.error(err);
		}
	}
};

