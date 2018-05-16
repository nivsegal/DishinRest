import React from 'react';

class TagsFilters extends React.Component {
	constructor(props) {
		super(props);
	}

	_handleClick = e => {

	}

	render() {
		const tags = this.props.tags.map(tag => tag.name);
		return <div className="dishCategories basicFlexLayout">
			{tags.map((tag, key) => {
				return <div key={key} className="catTab" >
					<span className={`catIcon ${tag}`}></span>
					<a href="#lactosefree" className="catName">{tag}</a>
				</div>
			})}
		</div>
	}
}

export default TagsFilters;