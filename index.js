var express = require('express');
var passport = require('passport');
var Strategy = require('passport-twitter').Strategy;
var dbx = require('./searcher.js');

var app = express();

passport.use(new Strategy({
	consumerKey: process.env['twitterkey'],
    consumerSecret: process.env['twittersecret'],
	callbackURL: 'https://soirana-pin-share.herokuapp.com/twitter/return'
},
function(token, tokenSecret, profile, cb) {
	dbx.findByUsername(profile.username, profile.displayName, function(err, user) {
    	
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      return cb(null, user);
    });
}));

app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'snow drakes', resave: false, saveUninitialized: false }));

passport.serializeUser(function(user, cb) {
cb(null, user.name);
});
passport.deserializeUser(function(name, cb) {
  dbx.findByName(name, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public')); 
app.use('/member', require('connect-ensure-login').ensureLoggedIn(), express.static('member'));
app.set('port', (process.env.PORT || 5000));

app.get('/twitter',
passport.authenticate('twitter'));

app.get('/twitter/return',
passport.authenticate('twitter', { failureRedirect: '/' }),
function(req, res) {
res.redirect('/member/mywall.html');
});

app.post('/addLink', function(request, response) {
	dbx.addLink(request.user.name, request.body);
	response.redirect('/member/adder.html');

});

app.get('/linksGet', function(req, res) {
	if (!req.xhr) {
		res.redirect('/');
		return;
	}
	if(req.user !== undefined){
		dbx.fetchLinks (req.user.name, req.query.name, function(listas){
		
			res.json({raw: listas});
			return;
		});
	} else{
	dbx.fetchLinks ("", req.query.name, function(listas){
		
			res.json({raw: listas});
		});
	}
	
});

app.get('/linksRemove', function(req, res) {
	if (!req.xhr) {
		res.redirect('/');
		return;
	}
	console.log (req.query);
	dbx.linksRemove(req.user.name, req.query);
	res.json({});
	
});

app.get('/*', function(request, response) {
		response.redirect('/');
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});