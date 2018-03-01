import React from 'react';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";
import MenuPopup from './menuPopup.jsx';

@observer class MenuLayout extends React.Component {
	constructor(props) {
		super(props);
	}

	@observable showOverlay = false;

	_handleAddMenuClick = e => {
		this.showOverlay = true;
		this.props.handleAddMenu();
	}

	_closePopup = () => {
		this.showOverlay = false;
	}

	render() {
		const { menus, noMenus } = this.props;
		const overlayDiv = this.showOverlay === true ? <div id="overlay"></div> : null;
		const menuPopup = this.showOverlay === true ? <MenuPopup closePopup={this._closePopup} /> : null;
		return <div id="menusContainer">
			{overlayDiv}
			{menuPopup}
			{noMenus ? (
				<div className="noElementsBtn" onClick={this._handleAddMenuClick}>
					<span className="plusIcon"></span>
					<p className="btnTxt">Add Menu</p> 
				</div>
			) : (
					menus.map((menu, ind) => {
						return <div></div>;
					}
					))}
		</div>;
	}
}

export default MenuLayout;