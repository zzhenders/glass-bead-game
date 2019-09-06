import React from 'react';
import User from './User';

class PostTile extends React.Component {
	render() {
		let post_id = this.props.post_id;
		return (
			<section
				className="post-tile"
				onClick={
					() => {
						this.props.setView('bead', post_id);
					}}>
				<h1>{this.props.title}</h1>
				<p>{this.props.content}</p>
				{ this.props.beadIsLoaded
					? <User
						uid={this.props.uid}
						user_id={this.props.user_id}
						users={this.props.users}
						setFollowing={this.props.setFollowing}
						following={this.props.following}
						/>
					: null }
			</section>
		);
	}
}

export default PostTile;
