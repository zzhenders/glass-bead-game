import React from 'react';
import User from './User';

class PostTile extends React.Component {
	render() {
		let post_id = this.props.post_id;
		return (
			<section
				className="post tile">
				<h1
				className="title"
				onClick={
					() => {
						this.props.setView('bead', post_id);
					}}
				>{this.props.title}</h1>
				<div className="content">{this.props.content}</div>
				<div className="options">
					{ this.props.beadIsLoaded
						? <User
							uid={this.props.uid}
							user_id={this.props.user_id}
							users={this.props.users}
							setFollowing={this.props.setFollowing}
							following={this.props.following}
							setView={this.props.setView}
							/>
						: null
					}
				</div>
			</section>
		);
	}
}

export default PostTile;
