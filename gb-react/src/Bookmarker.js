import React from 'react';

class Bookmarker extends React.Component {
	render() {
		const uid = this.props.uid;
		const post_id = this.props.post_id;
		return (
			<i className="bookmarker"
			id="pb{post_id}"
			onClick={ () => {this.props.onClick(uid, post_id)} }>'hi'
			</i>
		);
	}
}

export default Bookmarker;