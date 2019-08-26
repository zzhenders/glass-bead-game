import React from 'react';
import Panel from './Panel';
import { getPosts, getBookmarks, getUsernames, updateBookmark } from './Api';

class Bead extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	bookmarks: new Set(),
	    	users: {},
	    	references: {},
	    	responses: {},
	    	post: {},
	    	isLoaded: false,
	    };
	    this.lookupUsernames = this.lookupUsernames.bind(this);
	    this.lookupBookmarks = this.lookupBookmarks.bind(this);
	    this.setBookmarker = this.setBookmarker.bind(this);
	    this.addBookmark = this.addBookmark.bind(this);
	    this.removeBookmark = this.removeBookmark.bind(this);
	    this.isBookmarked = this.isBookmarked.bind(this);
  	}

  	setBookmarker = (uid, post_id) => {
		console.log(this.state.bookmarks);
		if (this.isBookmarked(post_id)) {
			updateBookmark(uid, post_id, 'delete')
			.then(() => this.removeBookmark(post_id));
		} else {
			updateBookmark(uid, post_id, 'create')
			.then(() => this.addBookmark(post_id));
			console.log(this.state.bookmarks);
		}
  	}

  	addBookmark(post_id) {
  		this.setState(({bookmarks}) => {
  			bookmarks: new Set(bookmarks).add(post_id)
  		});
  	}

  	removeBookmark(post_id) {
  		this.setState(({bookmarks}) => {
  			const newBookmarks = new Set(bookmarks);
  			newBookmarks.delete(post_id);
  			return {
  				bookmarks: newBookmarks
  			};
  		});
  	}

  	isBookmarked(post_id) {
  		return this.state.bookmarks.has(post_id);
  	}

	lookupUsernames(arrayOfUserIds) {
		getUsernames(arrayOfUserIds).then(data => {
			this.setState(({users}) => {
				return {users: data}
			});
			console.log(this.state.users);
		})
	};

	lookupBookmarks(arrayOfPostIds, uid) {
		getBookmarks(arrayOfPostIds, uid).then(data => {
			this.setState({bookmarks: data});
			console.log(this.state.bookmarks);
		})

	}

	componentDidMount() {
		let a = getPosts(`/posts/${this.props.data}/references`).then(
			(data) => {
				this.setState({references: data})
			});
		let b = getPosts(`/posts/${this.props.data}`).then(
			(data) => {
				this.setState({post: data})
			});
		let c = getPosts(`/posts/${this.props.data}/responses`).then(
			(data) => {
				this.setState({responses: data})
			});
		Promise.all([a, b, c]).then(() => {
			let userIds = new Set();
			let postIds = new Set();

			Object.entries(this.state.references).forEach(([key, post]) => {
				userIds.add(post.user_id);
				postIds.add(post.id);
			});
			Object.entries(this.state.responses).forEach(([key, post]) => {
				userIds.add(post.user_id);
				postIds.add(post.id);
			});
			userIds.add(this.state.post.user_id);
			postIds.add(this.state.post.id);

			this.lookupUsernames(Array.from(userIds));
			this.lookupBookmarks(Array.from(postIds), this.props.uid);
			this.setState({isLoaded: true});
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.data !== this.props.data) {
			let a = getPosts(`/posts/${this.props.data}/references`)
			.then(
				(data) => {
					this.setState({references: data})
				});
			let b = getPosts(`/posts/${this.props.data}`)
			.then(
				(data) => {
					this.setState({post: data})
				});
			let c = getPosts(`/posts/${this.props.data}/responses`)
			.then(
				(data) => {
					this.setState({responses: data})
				});
			Promise.all([a, b, c]).then(() => {
				let userIds = new Set();
				let postIds = new Set();

				Object.entries(this.state.references).forEach(([key, post]) => {
					userIds.add(post.user_id);
					postIds.add(post.id);
				});
				Object.entries(this.state.responses).forEach(([key, post]) => {
					userIds.add(post.user_id);
					postIds.add(post.id);
				});
				userIds.add(this.state.post.user_id);
				postIds.add(this.state.post.id);

				this.lookupUsernames(Array.from(userIds));
				this.lookupBookmarks(Array.from(postIds), this.props.uid);
				this.setState({isLoaded: true});
			});
		}
	}

	render() {
		return(
			<div className="bead" id="main">
				<Panel
					type="references"
					posts={this.state.references}
					users={this.state.users}
					beadIsLoaded={this.state.isLoaded}
					setView={this.props.setView}
				/>
				<div className="view">
					<section className="post-extended">
						<h1>There is a post here</h1>
						<p>Paragraph here</p>
					</section>
				</div>
				<Panel
					type="responses"
					posts={this.state.responses}
					users={this.state.users}
					beadIsLoaded={this.state.isLoaded}
					setView={this.props.setView}
				/>
			</div>
		);
	}
}

export default Bead;
