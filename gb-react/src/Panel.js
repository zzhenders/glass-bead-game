import React from 'react';
import PostTile from './Panel';

class Panel extends React.Component {
	render() {
		let posts = [];
		Object.entries(this.props.data).forEach(([key, post]) => {
			posts.push(
				<PostTile
					key={key}
					title={post.title}
					content={post.content}
				/>
			);	
		});
		let classAttribute = `panel ${this.props.type}`
		return (
			<div className={classAttribute} id="references">
				{posts}
			</div>
		);
	}
}

export default Panel;
