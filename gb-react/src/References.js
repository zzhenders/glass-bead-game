import React from 'react';

class References extends React.Component {
	constructor(props) {
	    super(props);
	    this.state = {
	    	numReferences: Object.keys(this.props.references).length,
	    	showSelector: false,
	    	selectionOptions: {},
	    	selection: undefined,
	    };
	    this.toggleShowSelector = this.toggleShowSelector.bind(this);
	    this.handleChange = this.handleChange.bind(this);
	    this.doReference = this.doReference.bind(this);
  	}

  	toggleShowSelector() {
  		this.setState({showSelector: !this.state.showSelector})
  	}

  	// this.props.references
  	// this.props.user_posts
  	// this.props.bookmarks
  	// this.props.addReference
  	// this.props.removeReference

  	handleChange(event) {
  		this.setState({selection: event.target.value});
  	}

  	doReference(event) {
  		event.preventDefault();
  		if (this.state.selection !== undefined) {
	  		this.props.addReference(
	  			this.state.selection,
	  			this.state.selectionOptions[this.state.selection]
	  			);
	  		this.setState({selection: undefined});
	  		this.toggleShowSelector();
	  	}
  	}

  	componentDidMount() {
  		let newSelectionOptions = {...this.props.user_posts, ...this.props.bookmarks};
  		Object.entries(this.props.references).forEach((key) => {
  			delete newSelectionOptions[key[0]];
  		});
  		this.setState({selectionOptions: newSelectionOptions});
  	}

  	componentDidUpdate(prevProps) {
  		if (prevProps.references !== this.props.references) {
  			let newSelectionOptions = {...this.props.user_posts, ...this.props.bookmarks};
	  		Object.entries(this.props.references).forEach((key) => {
	  			delete newSelectionOptions[key[0]];
	  		});
	  		this.setState({
	  			selectionOptions: newSelectionOptions,
  				numReferences: Object.keys(this.props.references).length,
	  		});
  		}
  	}

  	render() {
  		let options = [];
  		Object.entries(this.state.selectionOptions).forEach(([key, title]) => {
  			options.push(<option key={key} value={key}>{title}</option>);
  		})
		console.log(this.props.references, this.state.selection);
  		return (
  			//Button for each existing reference. onClick => dropdown menu
  			//if this.state.numReferences < 4:
  			//	Button: Add
  			<div>
  			{ !this.state.showSelector && this.state.numReferences < 4
  				? <b onClick={this.toggleShowSelector}>Add</b>
  				: null
  			}
  			{
  				this.state.showSelector && this.state.numReferences < 4
  				? <form onSubmit={this.doReference}>
  					<select
  						value={this.state.selection}
  						name="h"
  						onChange={this.handleChange}>{options}</select><input type="submit" value="add"/></form>
  				: null
  			}
  			</div>
		)
  	}
}

export default References;
