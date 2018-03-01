/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt');

module.exports = {
	attributes: {
		email: {
			type: 'email',
			required: true
		},
		password: {
			type: 'string',
			minLength: 6,
			required: true
		},
		provider: {
			type: 'string',
			defaultsTo: 'local'
		},

		uid: {
			type: 'integer'
		},
		name: {
			type: 'string'
		},

		admin: {
			type: 'boolean',
			defaultsTo: false
		},
		restaurants: {
			collection: 'restaurant',
			via: 'owners',
			dominant: true
		},
	},

	beforeCreate: (user, cb) => {
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				if (err) {
					console.log(err);
					cb(err);
				} else {
					user.password = hash;
					cb();
				}
			});
		});
	}
};


