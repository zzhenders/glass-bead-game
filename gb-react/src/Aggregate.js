import React from 'react';
import Post from './Post';
import { getPosts } from './Api';

class Aggregate extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	posts: {},
	    	isLoaded: false,
	    };
	}

	componentDidMount() {
		getPosts(this.props.data).then(
			(data) => {
				this.setState({
					posts: data,
					isLoaded: true,
				});
			}
		);
	}

	componentDidUpdate(prevProps) {
		if (prevProps.data !== this.props.data) { 
			getPosts(this.props.data).then(
				(data) => {
					this.setState({
						posts: data,
						isLoaded: true,
					});
				}
			);
		}
	}

	render() {
		let posts = [];
		Object.entries(this.state.posts).forEach(([key, post]) => {
			posts.push(
				<Post
					uid={this.props.uid}
					key={key}
					post_id={post.id}
					title={post.title}
					content={post.content}
					user_id={post.user_id}
					bookmarker={this.props.bookmarker}
				/>
			);	
		});
		return (
			<div className="aggregate" id="main">
				<div className="view flex-flow-row-wrap">
					{posts}
				</div>
			</div>
		);
	}
}

export default Aggregate;
