import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
				<div className="login container">
				<form
					className="login-form"
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
							/></td>
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
							/></td>
						</tr>
					</tbody></table>
					<label>
					<input
						type="submit"
						value="Login"
						hidden
					/>
					<FontAwesomeIcon icon="arrow-alt-circle-right" size="lg"/>
					<br/></label>
					{ this.state.error ? <b className="error">username or password incorrect<br/></b> : <br/> }
					<br/>
				</form>
				</div>
			</div>
		)
	}
}

export default Login;
