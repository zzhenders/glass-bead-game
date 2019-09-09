import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class NavButton extends React.Component {
	render() {
		return (
			<div>
				<FontAwesomeIcon id={this.props.id}
				icon={this.props.icon}
				alt={this.props.alt}
				size="2x"
				onClick={this.props.onClick} />
			</div>
		);
	}
}

export default NavButton;
