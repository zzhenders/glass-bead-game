import React from 'react';
import Bookmarker from './Bookmarker';

class Post extends React.Component {
	render() {
		return (
			<section className="post">
				<h1>{this.props.title}</h1>
				<p>{this.props.content}</p>
				<Bookmarker uid={this.props.uid} post_id={this.props.post_id} onClick={this.props.bookmarker}/>
			</section>
		);
	}
}

export default Post;
