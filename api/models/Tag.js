/**
 * Tag.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

	attributes: {
		connection: 'RateEatRest',
		name: { type: 'string', required: true },
		restaurant: { type: 'boolean', required: true },
		restFeatures: { model: 'restaurant' },
		menuItem: { model: 'menuitem' }
	}
};
