import React from 'react';
import {getPosts, writePost} from './Api';

class Write extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user_id: '',
			references: '',
			content: '',
			title: '',
			isLoaded: false
		};

		this.handleReferencesChange = this.handleReferencesChange.bind(this);
		this.handleTitleChange = this.handleTitleChange.bind(this);
		this.handleContentChange = this.handleContentChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleTitleChange(event) {
		this.setState({title: event.target.value});
	}

	handleContentChange(event) {
		this.setState({content: event.target.value});
	}

	handleReferencesChange(event) {
		this.setState({references: event.target.value});
	}

	handleSubmit(event) {
		event.preventDefault();
		let api;

		if (this.props.data === '') {
			api = '/posts/create'
		} else {
			api = `/posts/${this.props.data}/edit`
		}

		writePost(
			api,
			this.state.references,
			this.state.title,
			this.state.content,
			this.state.user_id,
			this.props.uid,
			).then( () => {
				this.props.setView(
					'aggregate',
					`/users/${this.props.uid}/following/recent-posts`,
				)
			});
	}

	componentDidMount() {
		if (this.props.data === '') {
			this.setState({user_id: this.props.uid})
		} else {
			getPosts(`/posts/${this.props.data}`)
			.then(
				(post) => {
					this.setState({
						content: post.content,
						title: post.title,
						user_id: post.user_id,
					});
				}
			);

			getPosts(`/posts/${this.props.data}/references`)
			.then(
				(posts) => {
					let referenceIds = [];
					let referencePosts = [];
					Object.entries(posts).forEach(([key, post]) => {
						referenceIds.push(key);
						referencePosts.push(post);
					});
					this.setState({
						references: referenceIds.join('.'),
					})
				}
			);
		}
		this.setState({isLoaded: true});
	}


	render() {
		return (
			<div className="edit view" id="main">
				<form onSubmit={this.handleSubmit} className="editor" method="post" action="/posts/create">
					references:<br/>
						<input
							type="text"
							name="references"
							value={this.state.references}
							onChange={this.handleReferencesChange}
						/><br/>
					title:<br/>
						<input
							type="text"
							name="title"
							value={this.state.title}
							onChange={this.handleTitleChange}
						/><br/>
					content:<br/>
						<textarea
							type="text"
							name="content"
							onChange={this.handleContentChange}
							value={this.state.content}
						></textarea><br/>
					submit: <input type="submit" name="submit" />
				</form>
			</div>
		);
	}
}

export default Write;
