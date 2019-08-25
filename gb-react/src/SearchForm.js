import React from 'react';

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
          			onChange={this.handleChange}/>
          		<input type="submit" value="submit" />
        	</form>
        );
	}
}

export default SearchForm;
