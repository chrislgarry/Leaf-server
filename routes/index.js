
/*
 * GET home page.
 */

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
