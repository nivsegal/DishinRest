/**
 * Restaurant.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		connection: 'RateEatRest',
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

		address: { type: 'string', required: true },
		hours: { type: 'array' },
		tags: {
			collection: 'tag',
			via: 'restFeatures'
		},
	}
};