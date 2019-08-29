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

  	handleChange(event) {
  		this.setState({selection: event.target.value});
  	}

  	doReference(event) {
  		event.preventDefault();
  		if (this.state.selection !== undefined && Object.keys(this.state.selectionOptions).length > 0) {
	  		this.props.addReference(
	  			this.state.selection,
	  			this.state.selectionOptions[this.state.selection]
	  			);
	  		this.setState({selection: undefined});
	  		this.toggleShowSelector();
	  	}
  	}

  	componentDidMount() {
  		let newSelectionOptions = {
  			...this.props.user_posts,
  			...this.props.bookmarks
  		};
  		Object.entries(this.props.references)
  		.forEach((key) => {
  			delete newSelectionOptions[key[0]];
  		});
  		if (Object.keys(newSelectionOptions).length > 0) {
  		  	this.setState({
  		  		selectionOptions: newSelectionOptions,
  				selection: Object.keys(newSelectionOptions)[0],
  		  	});
  		}
  	}

  	componentDidUpdate(prevProps) {
  		if (prevProps.references !== this.props.references) {
  			let newSelectionOptions = {
  				...this.props.user_posts,
  				...this.props.bookmarks
  			};
	  		Object.entries(this.props.references)
	  		.forEach((key) => {
	  			delete newSelectionOptions[key[0]];
	  		});
	  		if (Object.keys(newSelectionOptions).length > 0) {
		  		this.setState({
		  			selectionOptions: newSelectionOptions,
		  			selection: Object.keys(newSelectionOptions)[0],
	  				numReferences: Object.keys(this.props.references).length,
		  		});
	  		}
  		}
  	}

  	render() {
  		let options = [];
  		Object.entries(this.state.selectionOptions)
  		.forEach(([key, title]) => {
  			options.push(
  				<option
  					key={key}
  					value={key}
  				>
  					{title}
  				</option>
  			);
  		})

		let referenceItems = [];
		Object.entries(this.props.references)
		.forEach(([key, title]) => {
			referenceItems.push(
				<span key={key}>
					{title}
					<button
						onClick={
							() => {
								this.props.removeReference(key)
							}
						}
					> - </button>
				</span>
			);
		})

  		return (
  			<div>
  			{referenceItems}<br/>
  			{
  				!this.state.showSelector && this.state.numReferences < 4 && options.length > 0
  				? <button
  					onClick={this.toggleShowSelector}
  				  >Add Reference</button>
  				: null
  			}
  			{
  				this.state.showSelector && this.state.numReferences < 4 && options.length > 0
  				? <form onSubmit={this.doReference}>
  					<select
  						value={this.state.selection}
  						name="h"
  						onChange={this.handleChange}
  					>
  						{options}
  					</select>
  					<input type="submit" value="Add"/>
  				</form>
  				: null
  			}
  			</div>
		)
  	}
}

export default References;
