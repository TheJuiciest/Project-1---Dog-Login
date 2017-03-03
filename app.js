var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var path = require('path');
var User = require('./models/user.model');
var controller = require('./controllers/user.controller'); //need to add this we're using the method deinfed in user.controller that is being posted to the db from app.js 


var app = express();
var port = 3002; 
var db = 'mongodb://localhost/userDog';

mongoose.connect(db)

app.use(express.static('public'))			//which page to be displayed (our index.html)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));


app.get('/', function(req, res){  //specifies the route that the user goes to when they've loaded up their application
	res.render('index.html'); 	  //Because we've set our directory name to public, we can render the index.html and will automatically look in the public directory
})

//This is going to be the route that our app is going to look for when sending our username and email to the db to save
//Normally you'd create a routes.js file to hold all of those routes in one locations but this is the only one...
app.post('/register', controller.register); //We'll create a method called register within our controller that will handle the logic of adding our username and pw to our db
									//That said, we have to add this controller as a module to the app.js file

// API ROUTES

var apiRoutes = express.Router();				//this defines how things move to and from the mongo database for users

apiRoutes.get('/users', function(req, res) {	//this gets the users from the user database in mongo and return them as a json object
  User.find({}, function(err, users) {
    res.json(users);
  });
});   

// API ROUTES -------------------


// route to authenticate a user (POST http://localhost:8080/api/authenticate)
apiRoutes.post('/authenticate', function(req, res) {	//this will create the token for users when they login

  // find the user
  User.findOne({				//goes through the users in the database
    name: req.body.name			//this takes the name from the login form
  }, function(err, user) {

    if (err) throw err;			//if the name doesn't match something in the database it returns an error

    if (!user) {				//if user doesn't exist, it returns this...
      res.json({ success: false, message: 'You sure you already signed up? No user has been found.' });  

    } else if (user) {

     
      if (user.password != req.body.password) {		//if the user does exist, checks if the password matches and returns wrong password if it doesn't match
        res.json({ success: false, message: 'Looks like entered t.' });
      } else { 		//if the name is right and the password is right it creates a token (below)

        var token = jwt.sign(user, app.get('superSecret'), { 	//this generates the tokens using json webtokens
          expiresIn: 1440 // tells it to expire in 24 hours
        });

        
        res.json({						//returns a JSON object with the following information
          success: true,
          message: 'Enjoy your token!',
          token: token,
          name: req.body.name
        });
      }   

    }

  });
});










app.listen(port, function(){
	console.log('app listening to ' + port);
});
