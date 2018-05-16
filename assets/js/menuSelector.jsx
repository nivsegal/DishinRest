import React from 'react';

class MenuSelector extends React.Component {
	constructor(props) {
		super(props);
	}

	_handleClick = e => {
		
	}

	render() {
		if(this.props.menus.length === 0) return null;
		return <div className="dishCategories menu basicFlexLayout">
			{this.props.menus.map((menu, key) => {
				return <div className={'catTab menu' + (this.props.menuId === menu.id ? ' active' : '')} key={key} onClick={this._handleClick}>
					<a href={'#' + menu.title} className="catName menu">{menu.title}</a>
				</div>
			})}
			<svg height="30" width="30" className="plusBtn">
				<circle cx="15" cy="15" r="15" stroke="transparent" fill="#ed3b3a" />
				<text textAnchor="middle" x="50%" y="50%" dy=".3em" fill="#fff">+</text>
			</svg>
		</div>
	}
}

export default MenuSelector;