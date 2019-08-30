import React from 'react';

class User extends React.Component {
	render() {
		let username = this.props.users[this.props.user_id];
		let user_id = this.props.user_id;
		return (
			<>
				<b>{username}</b>
				<i onClick={() => {
					this.props.setFollowing(
						this.props.uid,
						user_id,
						username
						)
				}}>
				{ this.props.following.hasOwnProperty(user_id)
					? ' (unfollow)'
					: ' (follow)'
				}
				</i>
			</>
		)
	}
}

export default User;
