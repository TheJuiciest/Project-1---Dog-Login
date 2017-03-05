var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var jwt    = require('jsonwebtoken');     //let's us use webtokens 
var config = require('./config');       //let's us use our config file, which connects us to mongo user database
var path = require('path');
var User = require('./models/user.model');
var controller = require('./controllers/user.controller'); //need to add this we're using the method deinfed in user.controller that is being posted to the db from app.js 


var app = express();
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
  console.log ('username',req.body.username)
  // find the user
  User.findOne({				//goes through the users in the database
    username: req.body.username			//this takes the name from the login form
  }, function(err, user) {

    if (err) throw err;			//if the name doesn't match something in the database it returns an error

    if (!user) {				//if user doesn't exist, it returns this...
      res.json({ success: false, message: 'You sure you already signed up? No user has been found.' });  

    } else if (user) {

     
      if (user.password != req.body.password) {		//if the user does exist, checks if the password matches and returns wrong password if it doesn't match
        res.json({ success: false, message: 'Looks like you entered the wrong password.' });
      } else { 		//if the name is right and the password is right it creates a token (below)

        var token = jwt.sign(user, config.secret, { 	//this generates the tokens using json webtokens
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

apiRoutes.use(function(req, res, next) {

  // check header or url parameters or post parameters for token
  var token = req.body.token || req.query.token || req.headers['x-access-token'];

  // decode token
  if (token) {

    // verifies secret and checks exp
    jwt.verify(token, config.secret, function(err, decoded) {      
      if (err) {
        return res.json({ success: false, message: 'Failed to authenticate token.' });    
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;    
        next();
      }
    });

  } else {

    // if there is no token
    // return an error
    return res.status(403).send({ 
        success: false, 
        message: 'No token provided.' 
    });
    
  }
});

apiRoutes.get('/users', function(req, res) {  //this gets the users from the user database in mongo and return them as a json object
  User.find({}, function(err, users) {
    res.json(users);
  });
});


// apply the routes to our application with the prefix /api
app.use('/api', apiRoutes);               //this puts the /api on anything that uses api routers

app.listen(3002);