import React from 'react';
import Bookmarker from './Bookmarker';
import User from './User';

class PostExt extends React.Component {
	render() {
		return (
			<section className="post">
				<h1>{this.props.title}</h1>
				<p>{this.props.content}</p>
				<Bookmarker uid={this.props.uid} post_id={this.props.post_id} bookmarker={this.props.bookmarker}/>
				{ this.props.beadIsLoaded
					? <p><User
						user_id={this.props.user_id}
						users={this.props.users}
						/></p>
					: null }
			</section>
		);
	}
}

export default PostExt;
