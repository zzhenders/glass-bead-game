class App extends React.Component {
	constructor(props) {
	    super(props);

	    this.state = {
	    	data: {},
	    	page: "aggregate",
	    	uid: 2,
	    };
  	}

  	setView = (viewPage, viewData) => {
  		return () => {
  			this.setState(state => ({
  				page: viewPage,
  				data: viewData,
  			}));
  		}
  	} 

	render() {
		return (
			<div id="app">
				<Navbar />
				<Main page={this.state.page} data={this.state.data} uid={this.state.uid}/>
			</div>
		);
	}
}

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

  	render() {
		return (
			<nav>
				<NavButton id="home-btn" alt="Home"/>
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

class NavButton extends React.Component {

	render() {
		return (
			<img id={this.props.id}
			src=""
			alt={this.props.alt}
			onClick={this.props.onClick} />
		);
	}
}

class SearchForm extends React.Component {
	render() {
		return (
			<form id="search-form"
        	action="#">
          		<input id="search-terms" type="text" name="terms" />
          		<input type="submit" value="submit" />
        	</form>
        );
	}
}

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
  		return () => {
  			if (this.isBookmarked(post_id)) {
  				this.updateBookmark(uid, post_id, 'delete')
  				.then(this.removeBookmark(post_id));
  			} else {
  				this.updateBookmark(uid, post_id, 'create')
  				.then(this.addBookmark(post_id));
  			}
  		}
  	}

  	updateBookmark(uid, post_id, action) {
  		return () => {
  			uri = `/users/${uid}/bookmarks/${action}`
  			fetch(uri, {
  				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
				body: `post_id=${post_id}`,
  			});
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
					<Aggregate data={this.props.data} bookmarker={this.setBookmarker}/>
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

class Aggregate extends React.Component {
	render() {
		let posts = [];
		Object.entries(this.props.data).forEach(([key, post]) => {
			posts.push(
				<Post
					key={key}
					title={post.title}
					content={post.content}
					user_id={post.user_id}
				/>
			);	
		});
		return (
			<div className="aggregate" id="main">
				<div className="view flex-flow-row-wrap">
					{posts}
				</div>
			</div>
		);
	}
}

class Bead extends React.Component {
	render() {
		return(
			<div className="bead" id="main">
				<Panel type="references" data={this.props.data} />
				<div className="view">
					<section className="post-extended">
						<h1>There is a post here</h1>
						<p>Paragraph here</p>
					</section>
				</div>
				<Panel type="responses" data={this.props.data} />
			</div>
		);
	}
}

class Panel extends React.Component {
	render() {
		let posts = [];
		Object.entries(this.props.data).forEach(([key, post]) => {
			posts.push(
				<PostTile
					key={key}
					title={post.title}
					content={post.content}
				/>
			);	
		});
		let classAttribute = `panel ${this.props.type}`
		return (
			<div className={classAttribute} id="references">
				{posts}
			</div>
		);
	}
}

class Post extends React.Component {
	render() {
		return (
			<section className="post">
				<h1>{this.props.title}</h1>
				<p>{this.props.content}</p>
				<Bookmarker post_id={this.props.post_id} />
			</section>
		);
	}
}

class PostTile extends React.Component {
	render() {
		return (
			<section className="post-tile">
				<h1>{this.props.title}</h1>
				<p>{this.props.content}</p>
			</section>
		);
	}
}

class Bookmarker extends React.Component {
	render() {
		return (
			<i className="bookmarker"
			id="pb${this.props.post_id}"
			onClick={this.props.onClick(this.props.post_id)}>
			</i>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("root")
);

