class App extends React.Component {
	render() {
		return (
			<div id="app">
				<Navbar />
				<Main posts={this.props.posts}/>
			</div>
		);
	}
}

class Navbar extends React.Component {
	render() {
		return (
			<nav>
				<NavButton alt="Home"/>
				<NavButton alt="Root"/>
				<NavButton alt="Bookmarks"/>
				<NavButton alt="Add"/>
				<NavButton alt="Search"/>
				<NavButton alt="Settings"/>
				<NavButton alt="Logout"/>
			</nav>
		);
	}
}

class NavButton extends React.Component {
	alertMessage = () => {
		alert("You Clicked");
	}

	render() {
		return (
			<img src="" alt={this.props.alt} onClick={this.alertMessage} />
		);
	}
}

class Main extends React.Component {
	constructor() {
		super();
		this.state = {
			page: "aggregate" // Set current page view, default aggregate
		};
	}

	render() {
		switch (this.state.page) {
			case "aggregate":
				return (
					<Aggregate posts={this.props.posts}/>
				);
				break;

			case "bead":		
				return (
					<Bead />
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
				<Panel />
				<div className="view">
					<section className="post-extended">
						<h1>There is a post here</h1>
						<p>Paragraph here</p>
					</section>
				</div>
				<Panel />
			</div>
		);
	}
}

class Panel extends React.Component {
	render() {
		return (
			<div className="panel" id="references">
				<div className="post-tile">
					<h1>There is a post here</h1>
					<p>Paragraph here</p>
				</div>
			</div>
		)
	}
}

class Post extends React.Component {
	render() {
		return (
			<section className="post">
				<h1>{this.props.title}</h1>
				<p>{this.props.content}</p>
			</section>
		)
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

