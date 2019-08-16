class App extends React.Component {
	render() {
		return (
			<div id="app">
				<Navbar />
				<Main />
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
					<div id="main">
						<div className="view aggregate">
							<section className="post">
								<h1>There is a post here</h1>
								<p>Paragraph here</p>
							</section>
							<section className="post">
								<h1>There is a post here</h1>
								<p>Paragraph here</p>
							</section>
							<section className="post">
								<h1>There is a post here</h1>
								<p>Paragraph here</p>
							</section>
						</div>
					</div>
				);
				break;

			case "bead":		
				return (
					<div id="main">
						<div className="panel" id="references">
							<div className="post-tile">
								<h1>There is a post here</h1>
								<p>Paragraph here</p>
							</div>
							<div className="post-tile">
								<h1>There is a post here</h1>
								<p>Paragraph here</p>
							</div>
							<div className="post-tile">
								<h1>There is a post here</h1>
								<p>Paragraph here</p>
							</div>
							<div className="post-tile">
								<h1>There is a post here</h1>
								<p>Paragraph here</p>
							</div>
						</div>
						<div className="view bead">
							<section className="post-extended">
								<h1>There is a post here</h1>
								<p>Paragraph here</p>
							</section>
						</div>
						<div className="panel" id="responses">
							<div className="post-tile">
								<h1>There is a post here</h1>
								<p>Paragraph here</p>
							</div>
							<div className="post-tile">
								<h1>There is a post here</h1>
								<p>Paragraph here</p>
							</div>
							<div className="post-tile">
								<h1>There is a post here</h1>
								<p>Paragraph here</p>
							</div>
							<div className="post-tile">
								<h1>There is a post here</h1>
								<p>Paragraph here</p>
							</div>
						</div>
					</div>
				);
				break;
		}
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("root")
);
