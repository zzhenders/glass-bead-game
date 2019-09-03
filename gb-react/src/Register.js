import React from 'react';
import { registerUser } from './Api';

class Register extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			uname: '',
			pass: '',
			confirmPass: '',
			unameError: false,
			passError: false,
		}
		this.handleUnameChange = this.handleUnameChange.bind(this);
		this.handlePassChange = this.handlePassChange.bind(this);
		this.handleConfirmPassChange = this.handleConfirmPassChange.bind(this);
		this.validatePass = this.validatePass.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleUnameChange(event) {
		this.setState({uname: event.target.value});
	}

	handlePassChange(event) {
		this.setState({pass: event.target.value});
	}

	handleConfirmPassChange(event) {
		this.setState({confirmPass: event.target.value})
	}

	validatePass() {
		const badPasswordSet = new Set(['password',
							'PASSWORD',
							this.state.uname,
							`${this.state.uname}1`,
							`${this.state.uname}!`])
		if (this.state.pass.length < 8 || this.state.pass.length > 128) {
			return false
		} else if (badPasswordSet.has(this.state.pass)) {
			return false
		} else {
			return true
		}
	}

	handleSubmit(event) {
		event.preventDefault();
		if (this.state.uname !== '' &&
			this.state.pass !== '' &&
			this.state.pass === this.state.confirmPass) {
			if (this.validatePass() === true) {
				const data = {'uname': this.state.uname,
							  'pass': this.state.pass}
				registerUser(data)
				.then( (response) => {
					this.props.setUid(response.uid);
					this.props.setView(
						'aggregate',
						`/users/${response.uid}/following/recent-posts`
					)
				}).catch( (result) => {
					console.log(result);
					
				});
			}
		}
	}

	render() {
		return (
			<div className="register view" id="main">
				<form
					className="signup"
					onSubmit={this.handleSubmit}
				>
					<label htmlFor="uname">
					Username 
					</label>
					<input
						type="text"
						id="uname"
						name="uname"
						value={this.state.uname}
						onChange={this.handleUnameChange}
					/>{ this.state.unameError ? <b>Username already registered!</b> : null }
					<br/>
					<label htmlFor="pass">
					Password (minimum 8 characters, 1 number or symbol) 
					</label>
					<input
						type="password"
						id="pass"
						name="pass"
						value={this.state.pass}
						onChange={this.handlePassChange}
					/>{ this.state.passError ? <b>Password too short or simple!</b> : null }
					<br/>
					<label htmlFor="confirm-password">
					Confirm Password 
					</label>
					<input
						type="password"
						id="confirm-password"
						name="confirm-password"
						value={this.state.confirmPass}
						onChange={this.handleConfirmPassChange}
					/><br/>
					<input
						type="submit"
						value="Register User"
					/><br/>
				</form>
			</div>
		)
	}
}

export default Register;
