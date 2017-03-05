var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var minlength = [7, 'The value of path `{PATH}` (`{VALUE}`) is shorter than the minimum allowed length ({minlength})'];

var UserSchema = new Schema({
	firstname: {
		type: String,
		required: true
	},	
	lastname: {
		type: String,
		required: true
	},
	username: {
		type: String,
		minlength: minlength,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		minlength: minlength,
		required: true
	}
});

module.exports = mongoose.model('User', UserSchema);