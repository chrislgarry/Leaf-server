
/*
 * GET home page.
 */
var cloudinary = require('cloudinary');
users = [];
var contactBook = {};

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

var list = [];
var TIME_STAMP_DIFF = 20000;

// Handle receiving a new handshake's info.
exports.receiveTimeStamp = function(req, res){
	if (req.query.userId && req.query.timeStamp && req.query.userInfo) {
  		list.push({ userId : req.query.userId, 
  						  timeStamp : req.query.timeStamp,
  						  userInfo : req.query.userInfo });
  		res.send({message : 'success'});
  		console.log(list);
  	}
  	else {
  		res.send({message : 'failure'});
  	}
};

// Handle request for matching hand-shakes.
exports.match = function(req, res){
	if (req.query.userId && req.query.timeStamp) {
		var userId = req.query.userId;
		var currentTime = req.query.timeStamp;
		for (i = list.length - 1; i >= 0; i--) {
			if (currentTime - list[i].timeStamp > TIME_STAMP_DIFF) {
				res.send({ message : 'not_found'});
				return;
			}

			if (list[i].userId != userId) {
				contactBook[userId].push({ userId : list[i].userId,
				                           userInfo : list[i].userInfo});
				res.send({ message : 'success',
						   userInfo : list[i].userInfo});
				return;
			}
		}

		res.send({ message : 'not_found'});
		return;
	}
	else {
		res.send({ message : 'failure'});
		return;
	}
};


exports.list = function(req, res){
  if (req.query.username) {
    var username = req.query.username;
    res.send({ message : 'success', contact : contactBook[username]});
    return;
  }
  res.send({ message : 'failure'});
};

// Sign up a new user.
exports.signUp = function(req, res){
  if (req.query.username && req.query.password) {
  	var username = req.query.username;
  	var password = req.query.password;

  	if (exist(username)) {
  		res.send({ message : "username_exist"});
  		return;
  	}
  	users.push({ username : username,
  				 password : password,
  				 userInfo : req.query.userInfo});
    contactBook[username] = [users[users.length - 1]];
  	console.log(users);
  	res.send({ message : 'success'});
  	return;
  }

  res.send({ message : 'improper_username_or_password'});
};

// Login user.
exports.login = function(req, res) {
	if (req.query.username && req.query.password) {
		var username = req.query.username;
  		var password = req.query.password;

  		for (var i = 0; i < users.length; i++) 
  			if (users[i].username == username && users[i].password == password) {
  				res.send({ message : 'success',
  						       user : users[i], 
                     contacts : contactBook[username]});
  				return;
  			}
  		res.send({ message : 'not_found'});
  		return;
	}

	res.send({ message : 'failure'});
}

// Determine if there such an username exist in the database.
exist = function(username) {
	for (var i = 0; i < users.length; i++) {
		var user = users[i];
		if (user.username === username) {
			return true;
		}
	}
	return false;
}

// A test image from cloudinary.
exports.testImage = function(req, res){
	res.render('test_image', { cloudinary : cloudinary});
};
