import React from 'react';
import Aggregate from './Aggregate';
import Bead from './Bead';

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
		}
	}
}

export default Main;
