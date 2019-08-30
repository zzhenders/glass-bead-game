import React from 'react';
import { editUser, deleteUser } from './Api';

class Settings extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			uname: '',
			editUnameError: false,
			deleteUserError: false,
			deleteConfirm: false,
		}
		this.handleUnameChange = this.handleUnameChange.bind(this);
		this.handleEdit = this.handleEdit.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
		this.handleDeleteConfirm = this.handleDeleteConfirm.bind(this);
	}

	handleUnameChange(event) {
		this.setState({uname: event.target.value});
	}

	handleEdit(event) {
		event.preventDefault();
		if (this.state.uname !== '') {
			const data = {
				'uname': this.state.uname
			}
			editUser(this.props.uid, data)
			.then( (data) => {
				console.log(data);
				this.props.setView(
					'aggregate',
					`/users/${data.uid}/following/recent-posts`
				)
			}).catch( () => {
				this.setState({editUnameError: true});
			});
		}
	}

	handleDelete(event) {
		event.preventDefault();
		this.setState({deleteConfirm: true});
	}

	handleDeleteConfirm(event) {
		event.preventDefault();
		deleteUser(this.props.uid)
		.then( () => {
			this.props.setUid(undefined);
			this.props.setView('login', '');
		})
	}

	render() {
		return (
			<div className="settings view" id="main">
				<form
					className="user-settings"
					id="change-uname"
					onSubmit={this.handleEdit}
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
						value="Change Username"
					/><br/>
					{ this.state.editUnameError ? <b>That Username is Taken!</b> : null }
				</form>
				{ !this.state.deleteConfirm
					? <button onClick={this.handleDelete}>Delete Account</button>
					: <>
					<p>Are you sure you want to delete your account?</p>
					<button onClick={this.handleDeleteConfirm}>Delete My Account</button></>
				}
			</div>
		)
	}
}

export default Settings;
