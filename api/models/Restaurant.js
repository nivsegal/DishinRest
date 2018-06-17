/**
 * Restaurant.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		restName: { type: 'string', required: true, unique: true },

		description: { type: 'string', required: true },

		menus: {
			collection: 'menu',
			via: 'restaurant'
		},

		owners: {
			collection: 'user',
			via: 'restaurants'
		},

		menuItems: {
			collection: 'menuItem',
			via: 'restaurantId'
		},

		address: { type: 'string', required: true },
		hours: { type: 'json', columnType: 'array' },
		tags: {
			collection: 'tag',
			via: 'restFeatures'
		},
	},
};