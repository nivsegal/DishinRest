module.exports = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next();
	}else {
		return res.view('homepage');
	}
};