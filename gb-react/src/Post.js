import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Bookmarker from './Bookmarker';
import Respond from './Respond';
import User from './User';

class Post extends React.Component {
	render() {
		return (
			<section className="post">
				<h1
				className="title"
				onClick={
					() => this.props.setView('bead', this.props.post_id)
				}>{this.props.title}</h1>
				<div className="content">{this.props.content}</div>
				<div className="options">
					{ this.props.aggregateIsLoaded
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
						: null }
					{ this.props.uid === this.props.user_id
						? <span
							onClick={
								(evt)=>{
									evt.preventDefault();
									this.props.setView('write', this.props.post_id);
								}
							}
							>
							<FontAwesomeIcon className="edit" icon="edit" />
							</span>
						: null
					}
				</div>
			</section>
		);
	}
}

export default Post;
