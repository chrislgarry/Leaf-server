
/*
 * GET users listing.
 */
users = [];
exports.users;
var contactBook = {};
exports.contactBook;

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