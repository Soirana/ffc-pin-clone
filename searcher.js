var Datastore = require('nedb');
var db = new Datastore({ filename: 'users.db', autoload: true });

exports.findByUsername = function(username, displayname, cb) {
	db.find({name: username},function(err, docs) {
		if (err) {
			return cb(err, null);
		}
		if (docs.length>0) {
			return cb(null, docs[0]);
		}
		var profile = {name: username, displayName: displayname, links: []};
		db.insert(profile);
		db.find ({totals: true},function(err, docums) {
			if (docums.length ===0) {
				db.insert({totals: true, userList: [profile.name]});
			} else{
				db.update({totals: true},{ $push: { userList: profile.name} },{},function(){});
			}
		});
		return cb(null, profile);
	});
};

exports.findByName = function(name, cb) {
	db.find({name: name},function(err, docs) {
		if (err) {
			return cb(err, null);
		}
		if (docs.length === 0) {
    		  cb(new Error('User ' + id + ' does not exist'));
    		}
    	cb(null, docs[0]);
    });
};

exports.addLink = function(name, objekt) {
	db.update({name: name},{ $push: { links: objekt} },{},function(){});
};

exports.fetchLinks = function(username, name, cb) {
	var randName;
	if (name === 'false'){
		console.log('crash1?');
		db.find({name: username},function(err, docs) {
		if (docs.length === 0){
			return cb([]);
		}
		return cb(docs[0].links);		
		});
	}

	if (name === 'random') {
		db.find ({totals: true},function(err, docs) {
			if (docs.length === 0 ) {
				return cb([]);
			}
					randName = docs[0].userList[Math.floor(Math.random()*docs[0].userList.length)];
			db.find({name: randName},function(err, docums) {
				if (docums.length === 0 ) {
					return cb([]);
				}
				return cb(docums[0].links);
			})
		});
	} 
	if (name !== 'random' && name !== 'false') {
	db.find({name: name},function(err, docs) {
		if (err || docs.length === 0) {
			return cb([]);
		}
		return cb(docs[0].links);
	});
	}
  };

  exports.linksRemove = function(name, objekt) {
	db.update({name: name},{ $pull: { links: objekt} },{},function(){});
};