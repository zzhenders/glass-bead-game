import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class SearchForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			terms: ''
		};

		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleChange(event) {
		this.setState({terms: event.target.value});
	}

	handleSubmit(event) {
		let api = `/posts/search?terms=${this.state.terms}`
		this.props.setView('aggregate', api);
		this.props.toggleShowSearch();
		event.preventDefault();
  	}

	render() {
		return (
			<form
				onSubmit={this.handleSubmit}
				id="search-form"
        		action="#"
        	>
          		<input
          			id="search-terms"
          			type="text"
          			name="terms"
          			size="10"
          			onChange={this.handleChange}/>
          		<label>&nbsp;
          			<FontAwesomeIcon
          			icon="arrow-alt-circle-right"
          			size="lg"/>
	          		<input type="submit" value="submit" hidden/>
	          	</label>
        	</form>
        );
	}
}

export default SearchForm;
