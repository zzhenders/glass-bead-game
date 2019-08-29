import React from 'react';
import {getPosts, writePost} from './Api';
import References from './References';

class Write extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			user_id: '',
			references: {},
			bookmarks: {},
			user_posts: {},
			content: '',
			title: '',
			isLoaded: false
		};

		this.addReference = this.addReference.bind(this);
		this.removeReference = this.removeReference.bind(this);
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

	addReference(post_id, post_title) {
		const newReferences = {
			...this.state.references,
			[post_id]: post_title
		};
		this.setState({references: newReferences});
	}

	removeReference(post_id) {
		const newReferences = {
			...this.state.references
		};
		delete newReferences[post_id];
		this.setState({references: newReferences});
	}

	handleSubmit(event) {
		event.preventDefault();
		let api;

		if (this.props.post_id === '') {
			api = '/posts/create'
		} else {
			api = `/posts/${this.props.post_id}/edit`
		}

		let referencesArray = Object.keys(this.state.references);
		let data = {
				references: referencesArray,
				title: this.state.title,
				content: this.state.content,
				user_id: this.state.user_id,
				uid: this.props.uid,
			};

		writePost(
			api,
			data
			).then( () => {
				this.props.setView(
					'aggregate',
					`/users/${this.props.uid}/following/recent-posts`,
				)
			});
	}

	loadCreate() {
		this.setState({user_id: this.props.uid});

		let a = getPosts(`/users/${this.props.uid}/posts?mode=short`)
		.then(
			(posts) => {
				this.setState({
					user_posts: posts,
				})
			}
		);

		let b = getPosts(`/users/${this.props.uid}/bookmarks?mode=short`)
		.then(
			(posts) => {
				this.setState({
					bookmarks: posts,
				})
			}
		);

		Promise.all([a, b]).then(
			() => this.setState({isLoaded: true})
		);
	}

	loadEdit() {
		let a = getPosts(`/posts/${this.props.post_id}`)
			.then(
				(post) => {
					this.setState({
						content: post.content,
						title: post.title,
						user_id: post.user_id,
					});
				}
			);

		let b = getPosts(`/posts/${this.props.post_id}/references?mode=short`)
			.then(
				(posts) => {
					this.setState({
						references: posts,
					})
				}
			);

		let c = getPosts(`/users/${this.props.uid}/posts?mode=short`)
		.then(
			(posts) => {
				this.setState({
					user_posts: posts,
				})
			}
		);

		let d = getPosts(`/users/${this.props.uid}/bookmarks?mode=short`)
		.then(
			(posts) => {
				this.setState({
					bookmarks: posts,
				})
			}
		);

		Promise.all([a, b, c, d]).then(
			() => {
				this.setState({isLoaded: true})
			}
		);
	}

	componentDidMount() {
		if (this.props.post_id === '') {
			this.loadCreate()
		} else {
			this.loadEdit()
		}
	}

	render() {
		return (
			<div className="edit view" id="main">
				{ this.state.isLoaded
					? 
					<References
						references={this.state.references}
						bookmarks={this.state.bookmarks}
						user_posts={this.state.user_posts}
						addReference={this.addReference}
						removeReference={this.removeReference}
					/>
					: null
				}
				<form onSubmit={this.handleSubmit} className="editor" method="post" action="/posts/create">
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
