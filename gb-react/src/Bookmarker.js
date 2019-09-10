import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Bookmarker extends React.Component {
	render() {
		const uid = this.props.uid;
		const post_id = this.props.post_id;
		return (
			<span className="bookmarker"
			id="pb{post_id}"
			onClick={
				() => {this.props.bookmarker(uid, post_id)}
			}>
			{this.props.isBookmarked(post_id)
				? <FontAwesomeIcon icon={['fas', 'bookmark']}/>
				: <FontAwesomeIcon icon={['far', 'bookmark']}/>
			}
			</span>
		);
	}
}

export default Bookmarker;
