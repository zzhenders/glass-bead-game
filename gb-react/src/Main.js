import React from 'react';
import Aggregate from './Aggregate';
import { updateBookmark } from './Api';

class Main extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	bookmarks: new Set(),
	    };
	    this.setBookmarker = this.setBookmarker.bind(this);
	    this.addBookmark = this.addBookmark.bind(this);
	    this.removeBookmark = this.removeBookmark.bind(this);
	    this.isBookmarked = this.isBookmarked.bind(this);
  	}

  	setBookmarker = (uid, post_id) => {
		if (this.isBookmarked(post_id)) {
			updateBookmark(uid, post_id, 'delete')
			.then(this.removeBookmark(post_id));
		} else {
			updateBookmark(uid, post_id, 'create')
			.then(this.addBookmark(post_id));
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

	render() {
		switch (this.props.page) {
			case "aggregate":
				return (
					<Aggregate uid={this.props.uid} data={this.props.data} bookmarker={this.setBookmarker}/>
				);
				break;

			case "bead":		
				return (
					<Bead data={this.props.data} bookmarker={this.setBookmarker}/>
				);
				break;
		}
	}
}

export default Main;
