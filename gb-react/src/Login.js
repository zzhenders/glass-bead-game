import React from 'react';
import { loginUser } from './Api';

class Login extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			uname: '',
			error: false,
		}
		this.handleUnameChange = this.handleUnameChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleUnameChange(event) {
		this.setState({uname: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();
		if (this.state.uname !== '') {
			loginUser(this.state.uname)
			.then( (data) => {
				this.props.setUid(data.uid);
				this.props.setView(
					'aggregate',
					`/users/${data.uid}/following/recent-posts`
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
					</label>
					<input
						type="text"
						id="uname"
						name="uname"
						value={this.state.uname}
						onChange={this.handleUnameChange}
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
