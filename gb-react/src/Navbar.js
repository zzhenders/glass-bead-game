import React from 'react';
import NavButton from './NavButton';

class Navbar extends React.Component {
	constructor(props) {
	    super(props);

	    this.state = {
	    	isShowSearch: false,
	    };
  	}

  	toggleShowSearch = () => {
  		this.setState(state => ({
  			isShowSearch: !state.isShowSearch
  		}));
  	};

  	setView = (page, data) => {
  		return this.props.setView(page, data);
  	}

  	render() {
  		const uid = this.props.uid;
		return (
			<nav>
				<NavButton id="home-btn" alt="Home" onClick={this.setView('aggregate', `/users/${uid}/following/recent-posts`)} />
				<NavButton id="bookmarks-btn" alt="Bookmarks"/>
				<NavButton id="userroot-btn" alt="Root"/>
				<NavButton id="add-post-btn" alt="Add"/>
				<NavButton id="search-btn" alt="Search" onClick={this.toggleShowSearch}/>
				{this.state.isShowSearch ? <SearchForm /> : null}
				<NavButton id="settings-btn" alt="Settings"/>
				<NavButton id="logout-btn" alt="Logout"/>
			</nav>
		);
	}
}

export default Navbar;
