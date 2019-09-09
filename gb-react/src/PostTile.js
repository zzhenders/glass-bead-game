import React from 'react';
import User from './User';

class PostTile extends React.Component {
	render() {
		let post_id = this.props.post_id;
		return (
			<section
				className="post-tile"
			>
				<h1
				onClick={
					() => {
						this.props.setView('bead', post_id);
					}}
				>{this.props.title}</h1>
				<p>{this.props.content}</p>
				{ this.props.beadIsLoaded
					? <User
						uid={this.props.uid}
						user_id={this.props.user_id}
						users={this.props.users}
						setFollowing={this.props.setFollowing}
						following={this.props.following}
						setView={this.props.setView}
						/>
					: null }
			</section>
		);
	}
}

export default PostTile;
