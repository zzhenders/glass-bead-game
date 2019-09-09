import React from 'react';
import { loginUser } from './Api';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			uname: '',
			pass: '',
			error: false,
		}
		this.handleUnameChange = this.handleUnameChange.bind(this);
		this.handlePassChange = this.handlePassChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleUnameChange(event) {
		this.setState({uname: event.target.value});
	}

	handlePassChange(event) {
		this.setState({pass: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();
		if (this.state.uname !== '' &&
			this.state.pass !== '') {
			const data = {'uname': this.state.uname,
						  'pass': this.state.pass}
			loginUser(data)
			.then( (response) => {
				this.props.setUid(response.uid);
				this.props.setView(
					'aggregate',
					`/users/${response.uid}/following/recent-posts`
				)
			})
			.catch( () => {
				this.setState({error: true});
			});
		}
	}

	render() {
		return (
			<div className="login view" id="main">
				<form
					className="user-login"
					onSubmit={this.handleSubmit}
				>
					<label htmlFor="uname">
					Username 
					</label><br/>
					<input
						type="text"
						id="uname"
						name="uname"
						value={this.state.uname}
						onChange={this.handleUnameChange}
					/><br/>
					<label htmlFor="pass">
					Password 
					</label><br/>
					<input
						type="password"
						id="pass"
						name="pass"
						value={this.state.pass}
						onChange={this.handlePassChange}
					/><br/>
					<input
						type="submit"
						value="Login"
					/><br/>
					{ this.state.error ? <b>username or password incorrect</b> : null }
				</form>
			</div>
		)
	}
}

export default Login;
