import React from 'react';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";
import TagsFilters from './tagsFilters.jsx';
import DishGallery from './dishGallery.jsx';
import DishPreview from './dishPreview.jsx';
import DishPopup from './dishPopup.jsx';

@observer class DishLayout extends React.Component {
	constructor(props) {
		super(props);

		// this.menuId = props.menus.length > 0 ? props.menus[0].id : null;
		this._fetchTags();
		this._fetchDishes();
	}

	@observable showOverlay = false;
	// @observable menuId;
	@observable tags = [];
	@observable dishes = [{ title: 'Burger man', description: 'fefefeafffffffefoiaefoiaef', }];
	@observable currentDish = this.dishes[0];
	@observable chosenDish  = null;

	_handleAddMenuClick = e => {

	}

	_fetchTags = () => {
		io.socket.get('/tag', resData => {
			this.tags = resData;
		});
	}

	_fetchDishes = () => {
		io.socket.get(`/restaurant/${this.props.restaurant.id}`, resData => {
			this.dishes = resData.menuItems;
			// this.dishes = [{ title: 'Burger man', description: 'fefefeafffffffefoiaefoiaef', }];
			this.currentDish = this.dishes[0];
		});
	}

	_closePopup = () => {
		this.showOverlay = false;
	}

	_handleSubmit = menu => {
		this.props.handleSubmit(menu);
	}

	_showAddDishForm = () => {
		this.showOverlay = true;
	}
	// componentWillReceiveProps(newProps) {
	// 	const { menus, restaurant } = newProps;
	// 	if(menus.length > 0) {
	// 		this.menuId = menus[0].id;
	// 	}
	// }

	render() {
		const overlayDiv = this.showOverlay === true ? <div id="overlay"></div> : null;
		const dishPopup  = this.showOverlay === true ? <DishPopup dish={this.chosenDish} tags={this.tags} closePopup={this._closePopup} restaurantId={this.props.restaurant.id} /> : null;
		return <div id="dishesContainer" className="mainScreen">
			{overlayDiv}
			{dishPopup}
			<TagsFilters tags={this.tags} />
			<DishGallery dishes={this.dishes} />
			<DishPreview dish={this.currentDish} showAddDishForm={this._showAddDishForm} />
		</div>;
	}
}

export default DishLayout;