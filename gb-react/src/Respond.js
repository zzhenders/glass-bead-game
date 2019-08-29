import React from 'react';

class Respond extends React.Component {
	render() {
		return(
			<i onClick={
				() => {
					this.props.setView(
						'write',
						`?${this.props.post_id}`)
				}
			}>(respond)</i>
		)
	}
}

export default Respond;
