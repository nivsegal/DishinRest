/**
 * BackofficeController
 *
 * @description :: Server-side logic for managing backoffices
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	index: (req, res) => {
		return res.view('backoffice/index');
	},

	upload: (req, res) => {
		req.file('restaurantData').upload({
			dirname: require('path').resolve(sails.config.uploadFolder),
			saveAs: 'restaurant.xlsx'
		}, (err, uploadedFiles) => {
			if (err) return res.negotiate(err);
			BackOfficeService.process();
			return res.view('backoffice/index', { success: true });
		})
	}
};

