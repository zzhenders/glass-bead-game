import React from 'react';

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

export default NavButton;
