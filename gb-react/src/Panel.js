import React from 'react';
import PostTile from './PostTile';

class Panel extends React.Component {
	render() {
		let posts = [];
		let classAttribute = `panel ${this.props.type}`
		Object.entries(this.props.posts).forEach(([key, post]) => {
			posts.push(
				<PostTile
					key={key}
					post_id={post.id}
					title={post.title}
					content={post.content}
					user_id={post.user_id}
					users={this.props.users}
					beadIsLoaded={this.props.beadIsLoaded}
					setView={this.props.setView}
				/>
			);
		});
		return (
			<div className={classAttribute} id="references">
				{posts}
			</div>
		);
	}
}

export default Panel;
