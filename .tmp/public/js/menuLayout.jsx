import React from 'react';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";
import MenuPopup from './menuPopup.jsx';
import MenuForm from './menuForm.jsx';
import MenuSelector from './menuSelector.jsx';

@observer class MenuLayout extends React.Component {
	constructor(props) {
		super(props);

		this.menuId = props.menus.length > 0 ? props.menus[0].id : null;
		this._fetchCategories();
	}

	@observable showOverlay = false;
	@observable menuId;
	@observable categories = [];

	_handleAddMenuClick = e => {
		this.showOverlay = true;
		this.props.handleAddMenu();
	}

	_fetchCategories = () => {
		io.socket.get('/menuCategory/' + this.menuId, resData => {
			this.categories = resData;
		});
	}

	_closePopup = () => {
		this.showOverlay = false;
	}

	_handleSubmit = menu => {
		this.props.handleSubmit(menu);
	}

	componentWillReceiveProps(newProps) {
		const { menus, restaurant } = newProps;
		if(menus.length > 0) {
			this.menuId = menus[0].id;
		}
	}

	render() {
		const { menus, noMenus, restaurant } = this.props;
		if(noMenus === false) {
			const defaultMenu = menus[0];
		}
		const overlayDiv = this.showOverlay === true ? <div id="overlay"></div> : null;
		const menuPopup = this.showOverlay === true ? <MenuPopup closePopup={this._closePopup} /> : null;
		return <div id="menusContainer">
			<MenuSelector menuId={this.menuId} menus={this.props.menus} />
			{overlayDiv}
			{menuPopup}
			{noMenus ? (
				<MenuForm menuId={this.menuId} restaurant={restaurant} submitCallback={this._handleSubmit} />
			) : (
				<MenuForm menuId={defaultMenu.id} menus={this.props.menus} restaurant={restaurant} submitCallback={this._handleSubmit} />
			)}
		</div>;
	}
}

export default MenuLayout;