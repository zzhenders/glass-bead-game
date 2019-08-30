import React from 'react';
import Panel from './Panel';
import PostExt from './PostExt'
import { getPosts, updateBookmark, updateFollowing, getBookmarks,
		 getFollowing, getUsernames } from './Api';

class Bead extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	bookmarks: {},
	    	following: {},
	    	users: {},
	    	references: {},
	    	responses: {},
	    	post: {},
	    	isLoaded: false,
	    };
	    this.lookupBookmarks = this.lookupBookmarks.bind(this);
	    this.lookupFollowing = this.lookupFollowing.bind(this);
	    this.lookupUsernames = this.lookupUsernames.bind(this);
	    this.setBookmarker = this.setBookmarker.bind(this);
	    this.setFollowing = this.setFollowing.bind(this);
	    this.addBookmark = this.addBookmark.bind(this);
	    this.removeBookmark = this.removeBookmark.bind(this);
	    this.isBookmarked = this.isBookmarked.bind(this);
  	}

  	setBookmarker = (uid, post_id) => {
		if (this.isBookmarked(post_id)) {
			updateBookmark(uid, post_id, 'delete')
			.then(() => this.removeBookmark(post_id));
		} else {
			updateBookmark(uid, post_id, 'create')
			.then(() => this.addBookmark(post_id));
		}
  	}

  	setFollowing = (uid, user_id, uname) => {
  		if (this.state.following.hasOwnProperty(user_id)) {
  			updateFollowing(uid, user_id, 'unfollow')
  			.then(() => this.removeFollowing(user_id));
  		} else {
  			updateFollowing(uid, user_id, 'follow')
  			.then(() => this.addFollowing(user_id, uname));
  		}
  	}

  	addBookmark(post_id) {
  		const newBookmarks = {
  			...this.state.bookmarks,
  			[post_id]: true
  		}
  		this.setState({bookmarks: newBookmarks});
  	}

  	removeBookmark(post_id) {
  		const newBookmarks = {
  			...this.state.bookmarks,
  			[post_id]: false
  		}
  		this.setState({bookmarks: newBookmarks});
  	}

  	addFollowing(user_id, uname) {
  		const newFollowing = {
  			...this.state.following,
  			[user_id]: uname
  		}
  		this.setState({following: newFollowing});
  	}

  	removeFollowing(user_id) {
  		let newFollowing = this.state.following;
  		delete newFollowing[user_id];

  		this.setState({following: newFollowing});
  	}

  	isBookmarked(post_id) {
  		return this.state.bookmarks[post_id];
  	}

	lookupBookmarks(arrayOfPostIds, uid) {
		getBookmarks(arrayOfPostIds, uid).then(data => {
			this.setState({bookmarks: data});
		})
	}

	lookupFollowing(uid) {
		getFollowing(uid).then(data => {
			this.setState({following: data});
		})
	}

	lookupUsernames(arrayOfUserIds) {
		getUsernames(arrayOfUserIds).then(data => {
			this.setState({users: data});
		})
	};

	loadBead() {
		let a = getPosts(`/posts/${this.props.post_id}/references`).then(
			(data) => {
				this.setState({references: data})
			});
		let b = getPosts(`/posts/${this.props.post_id}`).then(
			(data) => {
				this.setState({post: data})
			});
		let c = getPosts(`/posts/${this.props.post_id}/responses`).then(
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
			this.lookupFollowing(this.props.uid);
			this.lookupBookmarks(Array.from(postIds), this.props.uid);
			this.setState({isLoaded: true});
		});
	}

	componentDidMount() {
		this.loadBead();
	}

	componentDidUpdate(prevProps) {
		if (prevProps.post_id !== this.props.post_id) {
			this.loadBead();
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
					<PostExt
						uid={this.props.uid}
						post_id={this.state.post.id}
						title={this.state.post.title}
						content={this.state.post.content}
						user_id={this.state.post.user_id}
						users={this.state.users}
						following={this.state.following}
						setFollowing={this.setFollowing}
						bookmarker={this.setBookmarker}
						isBookmarked={this.isBookmarked}
						beadIsLoaded={this.state.isLoaded}
						setView={this.props.setView}
					/>
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
