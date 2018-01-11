const passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	FacebookStrategy = require('passport-facebook'),
	GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
	InstagramStrategy = require('passport-instagram').Strategy,
	TwitterStrategy = require('passport-twitter').Strategy
	bcrypt = require('bcrypt');

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findOne({ id: id }, (err, user) => {
		done(err, user);
	});
});

const verifyHandler = (token, tokenSecret, profile, done) => {
	process.nextTick(() => {
		// console.log(profile)
		User.findOne({ uid: profile.id }, (err, user) => {
			if (user) {
				return done(null, user);
			} else {

				console.log(profile)
				//fallback for instagram...
				if (profile.provider === 'instagram') {
					const nameArr = profile.displayName.split(' ');
					profile.first_name = nameArr[0];
					profile.last_name = nameArr[1];
					profile.emails = new Array(1).fill({ value: profile.username + '@' + 'gmail.com' });
				}

				var data = {
					provider: profile.provider,
					uid: profile.id,
					name: profile.first_name + ' ' + profile.last_name,
					password: profile.emails[0].value
				};

				console.log(data);

				if (profile.emails && profile.emails[0] && profile.emails[0].value) {
					data.email = profile.emails[0].value;
				}

				User.create(data, (err, user) => {
					return done(err, user);
				});
			}
		});
	});
};

passport.use(new FacebookStrategy({
	clientID: "1165866970222123", // Use your Facebook App Id
	clientSecret: "b5a47642cd15662884cd089a81973f97", // Use your Facebook App Secret
	callbackURL: "/auth/facebook/callback",
	profileFields: ['id', 'emails', 'name'] //This	
}, verifyHandler));

passport.use(new GoogleStrategy({
	clientID: '632648325896-gktvp61gvqmut0sgnrbl89rfd1mbjapq.apps.googleusercontent.com',
	clientSecret: 'rIkQRhMGQ-cvUW5UlDcLCvt2',
	callbackURL: '/auth/google/callback'
}, verifyHandler));

passport.use(new InstagramStrategy({
	clientID: '066c10e2d2d248b5a48c84e4ad3e2262',
	clientSecret: '08e3b247f21e437d9cd1c1fe899f976e',
	callbackURL: "/auth/instagram/callback"
}, verifyHandler));

passport.use(new TwitterStrategy({
	consumerKey: 'USPoNa2aAGiiHPXh8VM54Sdbx',
	consumerSecret: 'EYrhdm8W1g2GhF2Qu9V8qSNun48fA36NeBn4ntrTKIoOTbFHMr',
	callbackURL: "/auth/twitter/callback"
},verifyHandler));

passport.use(new LocalStrategy({
	usernameField: 'email',
	passwordField: 'password'
}, (email, password, done) => {

	User.findOne({ email: email }, (err, user) => {
		if (err) { return done(err); }
		if (!user) {
			return done(null, false, { message: 'Incorrect email.' });
		}

		bcrypt.compare(password, user.password, (err, res) => {
			if (!res)
				return done(null, false, {
					message: 'Invalid Password'
				});
			var returnUser = {
				email: user.email,
				createdAt: user.createdAt,
				id: user.id
			};
			return done(null, returnUser, {
				message: 'Logged In Successfully'
			});
		});
	});
}
));