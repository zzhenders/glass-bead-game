import React from 'react';
import Bookmarker from './Bookmarker';
import Respond from './Respond';
import User from './User';

class PostExt extends React.Component {
	render() {
		return (
			<section className="post ext">
				<h1>{this.props.title}</h1>
				<p>{this.props.content}</p>
				{ this.props.uid === this.props.user_id
					? <i onClick={()=>{ this.props.setView('write', this.props.post_id)}}>(edit)</i>
					: <br/>
				}
				{ this.props.beadIsLoaded
					? <div><Bookmarker
						uid={this.props.uid}
						post_id={this.props.post_id}
						bookmarker={this.props.bookmarker}
						isBookmarked={this.props.isBookmarked}
						/>

						<p><User
						uid={this.props.uid}
						user_id={this.props.user_id}
						users={this.props.users}
						setFollowing={this.props.setFollowing}
						following={this.props.following}
						setView={this.props.setView}
						/></p>

						<Respond
						setView={this.props.setView}
						post_id={this.props.post_id}
						/>

						</div>
					: null }
			</section>
		);
	}
}

export default PostExt;
