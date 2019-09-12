import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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
			.then( () => {
				this.props.setView(
					'aggregate',
					`/users/${this.props.uid}/following/recent-posts`
				)
			}).catch( () => {
				this.setState({editUnameError: true})
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
				<div className="container">
					<form
						className="user-settings"
						id="change-uname"
						onSubmit={this.handleEdit}
					>
						<label htmlFor="uname">
							Change Username: 
						</label><br />
						<input
							type="text"
							id="uname"
							name="uname"
							value={this.state.uname}
							onChange={this.handleUnameChange}
						/><br />
						<div className="settings-options">
							<span id="change-name">
								<input
									type="submit"
									value="Change Username"
									hidden
								/>
								<FontAwesomeIcon icon="user-check" />
							</span>
							{ !this.state.deleteConfirm
								? <span id="delete-user" onClick={this.handleDelete}>
									<FontAwesomeIcon icon="user-minus" />
								</span>
								: <>
									<span id="delete-user"
										className="warning"
										onClick={this.handleDeleteConfirm}
									>
										<FontAwesomeIcon icon="user-minus" />
									</span><br/>
									<p className="warning">Are you sure you want to delete your account?</p>
								</>
							}
						</div>				
					</form>
					{ this.state.editUnameError ? <b>That Username is Taken!</b> : null }
					
				</div>
			</div>
		)
	}
}

export default Settings;
