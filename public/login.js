import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';


class Login extends Component {
	getInitialState() {
		return {
			username: "",
			password: ""
		};
	},
	usernameChanged(event) {
		this.setState( {username: event.target.value} )
	},
	passwordChanged(event) {
		this.setState({ password: event.target.value})
	},
	loginEvent() {
		$.ajax({
			method: POST, 
			url: '/api/authenticate',
			data: JSONstringify({
				username: this.state.username,
				password: this.sate.password
			})
		})
		.done(function(result){
			console.log(result)
		})
	},
	render() {
		return (
			<div>
				<form className='login'>
					<h2>Login Your Life</h2>
					<input name="username" type="username" placeholder="Username" /></br>
					<input name="password" type="password" placeholder="Enter Password" /></br>
					<button className="loginButton" 
					onClick={this.loginEvent}>Log Me On In</button>
				</form>
			</div>
			);
	}
}


export default Login;