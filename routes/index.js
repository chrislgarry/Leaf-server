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
var TIME_DIFF = 6000;
var userInfoMap = {};

// Handle receiving a new handshake's info.
exports.receiveTimeStamp = function(req, res){
	if (req.query.username && req.query.timeStamp) {
		var username = req.query.username;
		var timeStamp = req.query.timeStamp;
		// Check if there are multiple requests.
		for (var i = list.length - 1; i >= 0; i--)
			if (list[i].username == username && timeStamp - list[i].timeStamp < TIME_DIFF) {
				res.send({message : 'failure'});
				return;
			}

		// If there is no multiple request.
  		list.push({ username : req.query.username, 
  						  timeStamp : req.query.timeStamp,
  						  userInfo : req.query.userInfo });
  		res.send({message : 'success'});
  	}
  	else {
  		res.send({message : 'failure'});
  	}
};

// // Handle request for matching hand-shakes.
// exports.match = function(req, res){
// 	if (req.query.username && req.query.timeStamp) {
// 		var username = req.query.username;
// 		var currentTime = req.query.timeStamp;
// 		for (i = list.length - 1; i >= 0; i--) {
// 			if (currentTime - list[i].timeStamp > TIME_STAMP_DIFF) {
// 				res.send({ message : 'not_found'});
// 				return;
// 			}

// 			if (list[i].username != username) {
// 				contactBook[username].push({ username : list[i].username,
// 				                           userInfo : userInfoMap[list[i].username]});
// 				res.send({ message : 'success',
// 					       username : list[i].username,
// 						   userInfo : userInfoMap[list[i].username]});
// 				return;
// 			}
// 		}

// 		res.send({ message : 'not_found'});
// 		return;
// 	}
// 	else {
// 		res.send({ message : 'failure'});
// 		return;
// 	}
// };


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
  		res.redirect('/login?username=' + username + '&password=' + password);
  		return;
  	}
  	users.push({ username : username,
  				 password : password,
  				 userInfo : req.query.userInfo});
  	userInfoMap[username] = req.query.userInfo;
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


// Helper function to match(): returns true if two handshakes match.
is_match = function(handshake_one, handshake_two) {
	
	match = false;
	
	/*Pseudocode
		output_array = cross_correlate(handshake_one,handshake_two);
		if(output_array contains a global maximum (a peak) above a certain threshold){
			match = true;
		}
	*/

	return match;
}

// Find a matching handshake.
exports.match = function(req, res) {

	if (req.query.handshake) {

		var query_handshake = req.query.handshake;
		
		/*
		for each handshake in database
			if(is_match(query_handshake, db_handshake)){
				res.send({ message : 'success', matched_user : username for db_handshake});
	   			return;
			}
		*/

  		res.send({ message : 'match_not_found'});
  		return;
	}

	res.send({ message : 'matching failure'});
}


// A test image from cloudinary.
exports.testImage = function(req, res){
	res.render('test_image', { cloudinary : cloudinary});
};
