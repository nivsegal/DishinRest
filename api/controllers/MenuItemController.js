/**
 * MenuItemController
 *
 * @description :: Server-side logic for managing menuitems
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	upload: async (req, res) => {
		const path = require('path');
		const inputs = req.allParams();
		const fileName = `temp.${inputs.fileName.split('.').pop()}`;
		try {
			await req.file('dishImage').upload({
				dirname: path.resolve(sails.config.uploadFolder) + `/${req.user.uid}`,
				saveAs: fileName
			});
		} catch (err) {
			return res.negotiate(err);
		}
		return res.json({fileName});
	},

	createDish: async (req, res) => {
		const path = require('path');
		const fs = require('fs');
		const inputs = req.allParams();
		const oldPath = `${path.resolve(sails.config.uploadFolder)}/${req.user.uid}/temp.${inputs.fileName.split('.').pop()}`;
		const fileName = inputs.fileName;
		delete inputs.fileName;
		try {
			const menuItem = await MenuItem.create(inputs);
			const newPath = `${path.resolve(sails.config.uploadFolder)}/${req.user.uid}/${menuItem.id}.${fileName.split('.').pop()}`;
			fs.renameSync(oldPath, newPath);
		} catch (err) {
			console.log(err)
		}
		return res.json('success');
	}
};

