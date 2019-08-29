import React from 'react';
import Aggregate from './Aggregate';
import Bead from './Bead';
import Login from './Login';
import Register from './Register';
import Write from './Write'

class Main extends React.Component {

	render() {
		switch (this.props.page) {
			case "aggregate":
				return (
					<Aggregate
						uid={this.props.uid}
						api={this.props.data}
						setView={this.props.setView}
					/>
				);
				break;

			case "bead":		
				return (
					<Bead
						uid={this.props.uid}
						post_id={this.props.data}
						setView={this.props.setView}
					/>
				);
				break;
			case "write":
				return (
					<Write 
						uid={this.props.uid}
						post_id={this.props.data}
						setView={this.props.setView}
					/>
				);
				break;
			case "register":
				return (
					<Register
						setView={this.props.setView}
						setUid={this.props.setUid}
					/>
				);
				break;
			case "login":
				return (
					<Login
						setView={this.props.setView}
						setUid={this.props.setUid}
					/>
				);
				break;
			default:
				return (
					<Login
						setView={this.props.setView}
						setUid={this.props.setUid}
					/>
				);
		}
	}
}

export default Main;
