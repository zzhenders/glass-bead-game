import React from 'react';
import Aggregate from './Aggregate';
import Bead from './Bead';
import Write from './Write'

class Main extends React.Component {

	render() {
		switch (this.props.page) {
			case "aggregate":
				return (
					<Aggregate
						uid={this.props.uid}
						data={this.props.data}
						setView={this.props.setView}
					/>
				);
				break;

			case "bead":		
				return (
					<Bead
						uid={this.props.uid}
						data={this.props.data}
						setView={this.props.setView}
					/>
				);
				break;
			case "write":
				return (
					<Write 
						uid={this.props.uid}
						data={this.props.data}
						setView={this.props.setView}
					/>
				);
		}
	}
}

export default Main;
