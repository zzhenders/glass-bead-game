import React from 'react';
import Panel from './Panel';
import { getUsernames } from './Api';

class Bead extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	users: new Object(),
	    	isLoaded: false,
	    };
	    this.lookupUsernames = this.lookupUsernames.bind(this);
	}

	lookupUsernames(arrayOfUsernames) {
		getUsernames(arrayOfUsernames).then(data => {
		})
	};

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

export default Bead;
