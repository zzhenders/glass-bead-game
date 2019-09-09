import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Respond extends React.Component {
	render() {
		return(
			<i onClick={
				() => {
					this.props.setView(
						'write',
						`?${this.props.post_id}`)
				}
			}>
			<FontAwesomeIcon icon="reply" />
			</i>
		)
	}
}

export default Respond;
