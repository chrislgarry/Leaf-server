
/*
 * GET users listing.
 */
users = [];
exports.users;

exports.list = function(req, res){
  res.send("respond with a resource");
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
  	console.log(users);
  	res.send({ message : 'success'});
  	return;
  }

  res.send({ message : 'improper_username_or_password'});
};

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