import React from 'react';

class PostTile extends React.Component {
	render() {
		return (
			<section className="post-tile">
				<h1>{this.props.title}</h1>
				<p>{this.props.content}</p>
			</section>
		);
	}
}

export default PostTile;
