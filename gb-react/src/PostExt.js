import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Bookmarker from './Bookmarker';
import Respond from './Respond';
import User from './User';

class PostExt extends React.Component {
	render() {
		return (
			<article className="post ext">
				<h1
				className="title"
				>{this.props.title}</h1>
				<div className="content">{this.props.content}</div>
				<div className="options">
					{ this.props.beadIsLoaded
						? <><User
							uid={this.props.uid}
							user_id={this.props.user_id}
							users={this.props.users}
							setFollowing={this.props.setFollowing}
							following={this.props.following}
							setView={this.props.setView}
							/>

							<Bookmarker
							uid={this.props.uid}
							post_id={this.props.post_id}
							bookmarker={this.props.bookmarker}
							isBookmarked={this.props.isBookmarked}
							/>

							<Respond
							setView={this.props.setView}
							post_id={this.props.post_id}
							/>

							</>
						: null
					}
					{ this.props.uid === this.props.user_id
						? <i onClick={()=>{ this.props.setView('write', this.props.post_id)}}>
						<FontAwesomeIcon icon="edit" />
						</i>
						: null
					}
				</div>
			</article>
		);
	}
}

export default PostExt;
