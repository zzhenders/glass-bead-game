import React from 'react';

class User extends React.Component {
	render() {
		let username = this.props.users[this.props.user_id];
		return (
			<b>{username}</b>
		)
	}
}

export default User;
