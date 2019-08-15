import Main from "./Main"
import Navbar from "./Navbar"

class App extends React.Component {
	render() {
		return (
			<div>
				<Navbar />
				<Main />
			</div>
		);
	}
}

ReactDOM.render(
	<App />,
	document.getElementById("root")
);
