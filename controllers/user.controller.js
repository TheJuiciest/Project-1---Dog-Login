var User = require('../models/user.model') //creates a reference to our model, .. because we have to go up one level

exports.register = function(req, res){  //Supplies the logic of being able to register a new user
	var newUser = new User(); 			//creates a new user object; think of it as a replica of the user model

	newUser.firstname = req.body.firstName;
	newUser.lastname = req.body.lastName;
	newUser.username = req.body.username; //grabs the name=username in the index file and passes it to the db; can use BP cuz we did app.use in app.js
	newUser.email = req.body.email;
	newUser.password = req.body.password;

	newUser.save(function(err, user){
		if(err){
		//console.log(err.message);
		//console.log(err.errors.username.message);
		res.send('error registering user');
		}else{
		 //console.log(user);				//this will console log all of the model properties of each user that signs up
		 res.redirect('/index.html');	
		}
	});							//grabbed references of the user props from our view, we need to save them
};