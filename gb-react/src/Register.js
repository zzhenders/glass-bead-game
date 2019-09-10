import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
				}).catch( () => {
					this.setState({unameError: true});
					
				});
			} else {
				this.setState({passError: true});
			}
		}
	}

	render() {
		return (
			<div className="register view" id="main">
				<div className="register container">
					<form
						className="signup"
						onSubmit={this.handleSubmit}
					><br/>
						<table><tbody>
						<tr>
							<td><label htmlFor="uname">
							Username 
							</label></td>
							<td><input
								type="text"
								id="uname"
								name="uname"
								value={this.state.uname}
								onChange={this.handleUnameChange}
							/>
							</td>
						</tr>
						<tr>
							<td><label htmlFor="pass">
							Password  
							</label></td>
							<td><input
								type="password"
								id="pass"
								name="pass"
								value={this.state.pass}
								onChange={this.handlePassChange}
							/>
							</td>
						</tr>
						<tr>
							<td><label htmlFor="confirm-password">
							Confirm 
							</label></td>
							<td><input
								type="password"
								id="confirm-password"
								name="confirm-password"
								value={this.state.confirmPass}
								onChange={this.handleConfirmPassChange}
							/></td>
						</tr>
						</tbody></table>
						<label>
							<input
								type="submit"
								value="Register User"
								hidden
							/>
							<FontAwesomeIcon icon="user-plus" /><br/>
						</label>
					{ this.state.unameError ? <b className="error">Username already registered!<br/></b> : <br/> }
					{ this.state.passError ? <b className="error">Password too short or simple!<br/></b> : <br/> }
					</form>
				</div>
			</div>
		)
	}
}

export default Register;
