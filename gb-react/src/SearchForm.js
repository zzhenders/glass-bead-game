import React from 'react';

class SearchForm extends React.Component {
	render() {
		return (
			<form id="search-form"
        	action="#">
          		<input id="search-terms" type="text" name="terms" />
          		<input type="submit" value="submit" />
        	</form>
        );
	}
}

export default SearchForm;
