class App extends React.Component {
	constructor(props) {
	    super(props);

	    this.state = {
	    	page: "aggregate",
	    	data: {},
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
				<Main page={this.state.page} data={this.state.data}/>
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
	render() {
		switch (this.props.page) {
			case "aggregate":
				return (
					<Aggregate data={this.props.data}/>
				);
				break;

			case "bead":		
				return (
					<Bead data={this.props.data}/>
				);
				break;
		}
	}
}

class Aggregate extends React.Component {
	render() {
		let posts = [];
		Object.entries(this.props.posts).forEach(([key, post]) => {
			posts.push(
				<Post
					key={key}
					title={post.title}
					content={post.content}
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
				<Panel type="references" posts={this.props.posts} />
				<div className="view">
					<section className="post-extended">
						<h1>There is a post here</h1>
						<p>Paragraph here</p>
					</section>
				</div>
				<Panel type="responses" posts={this.props.posts} />
			</div>
		);
	}
}

class Panel extends React.Component {
	render() {
		let posts = [];
		Object.entries(this.props.posts).forEach(([key, post]) => {
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

const posts_static = {
	1: {
		id: 1,
		title: "Poor Lemongrab",
		content: "You try your best",
		user_id: 2,
		created: 1,
	},
	2: {
		id: 2,
		title: "One Million Years Dungeon!!",
		content: "AaAAaaaAAaaaAaaaaAAAaAaaa",
		user_id: 1,
		created: 1,
	},
	3: {
		id: 3,
		title: "Here's a song I just wrote",
		content: "Song song song song song song song",
		user_id: 3,
		created: 1,
	},
	4: {
		id: 4,
		title: "Gunther",
		content: "You are very very bad!",
		user_id: 4,
		created: 1,
	}
}

ReactDOM.render(
	<App posts={posts_static} />,
	document.getElementById("root")
);

