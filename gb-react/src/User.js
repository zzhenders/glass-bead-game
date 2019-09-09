import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class User extends React.Component {
	render() {
		let username = this.props.users[this.props.user_id];
		let user_id = this.props.user_id;
		return (
			<>
				<b className="username">{username}</b>
				<i onClick={(event) => {
					event.stopPropagation();
					this.props.setView(
						'aggregate',
						`/users/${user_id}/posts/root`);
				}}>(root)</i>
				<i onClick={(event) => {
					event.stopPropagation();
					this.props.setView(
						'aggregate',
						`/users/${user_id}/posts?mode=full`);
				}}>(all)</i>
				<i onClick={(event) => {
					event.stopPropagation();
					this.props.setFollowing(
						this.props.uid,
						user_id,
						username
						)
				}}>
				{ this.props.following.hasOwnProperty(user_id)
					? <FontAwesomeIcon icon="minus-circle" />
					: <FontAwesomeIcon icon="plus-circle" />
				}
				</i>
			</>
		)
	}
}

export default User;
