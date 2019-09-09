import React from 'react';
import { logoutUser } from './Api';
import NavButton from './NavButton';
import SearchForm from './SearchForm';

class Navbar extends React.Component {
	constructor(props) {
	    super(props);

	    this.state = {
	    	isShowSearch: false,
	    };
  	}

  	logout(uid) {
  		logoutUser({'uid': uid})
  	}

  	toggleShowSearch = () => {
  		this.setState(state => ({
  			isShowSearch: !state.isShowSearch
  		}));
  	};

  	render() {
  		const uid = this.props.uid;
		return (
				<nav>
				{ uid !== undefined
				?
					<>
					<NavButton
						id="home-btn"
						alt="Home"
						icon="home"
						onClick={() => {
							this.props.setView(
								'aggregate',
								`/users/${uid}/following/recent-posts`
							)}
						}
					/>
					<NavButton
						id="bookmarks-btn"
						alt="Bookmarks"
						icon={['fas', 'bookmark']}
						onClick={() => {
							this.props.setView(
								'aggregate',
								`/users/${uid}/bookmarks`
							)}
						}
					/>
					<NavButton
						id="userroot-btn"
						alt="Root"
						icon="user"
						onClick={() => {
							this.props.setView(
								'aggregate',
								`/users/${uid}/posts/root`
							)}
						}
					/>
					<NavButton
						id="add-post-btn"
						alt="Add"
						icon="edit"
						onClick={() => {
							this.props.setView(
								'write',
								'',
							)}
						}
					/>
					<NavButton
						id="search-btn"
						alt="Search"
						icon="search"
						onClick={this.toggleShowSearch}/>
					{this.state.isShowSearch
						? <SearchForm toggleShowSearch={this.toggleShowSearch} setView={this.props.setView}/>
						: null
					}
					<NavButton
						id="settings-btn"
						alt="Settings"
						icon="cog"
						onClick={() => {
							this.props.setView('settings', '')
						}}
					/>
					<NavButton
						id="logout-btn"
						alt="Logout"
						icon="sign-out-alt"
						onClick={
							() => {
								this.logout(uid);
								this.props.setUid(undefined);
								this.props.setView('login', '');
							}
						}/>
					</>
				:
					<>
					<NavButton
						id="create-user-btn"
						alt="Create Account"
						icon="user-plus"
						onClick={
							() => this.props.setView('register', '')
						}/>
					<NavButton
						id="login-btn"
						alt="Login"
						icon="sign-in-alt"
						onClick={
							() => this.props.setView('login', '')
						}/>
					</>
				}
			</nav>
		);
	}
}

export default Navbar;
