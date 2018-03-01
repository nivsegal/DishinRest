import React from 'react';
import ReactDOM from 'react-dom';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";
import NavigationPane from "./navigationPane.jsx";
import RestaurantForm from './restaurantForm.jsx';
import CategoryForm from './categoryForm.jsx';
import RestaurantPopup from './restaurantPopup.jsx';
import DishForm from './dishForm.jsx';
import MenuForm from './menuForm.jsx';
import AppNavigation from './appNavigation.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Header from './header.jsx';
import MenuLayout from './menuLayout.jsx';
import MenuPopup from './menuPopup.jsx';

@observer class RestaurantView extends React.Component {

	constructor(props) {
		super(props);

		this.headerTexts = {
			'menus': 'My Menus',
			'categories': 'My Categories',
			'dishes': 'My Dishes',
			'dashboard': 'My Dashboard'
		}
	}

	@observable data = this.props.data;
	@observable userData = data;
	@observable menus = null;
	@observable notifications = [];
	@observable restaurant = null;
	@observable restaurantIds = this.props.data.restaurants.map(restaurant => restaurant.id);
	@observable showForm = false;
	@observable showMenuForm = false;
	@observable showCategoryForm = false;
	@observable showdishForm = false;
	@observable showMenuPopup = false;
	@observable menuId = null;
	@observable dishId = null;
	@observable categoryId = null;
	@observable menu = null;
	@observable category = null;
	@observable dish = null;
	@observable activeTab = 'dashboard';
	@observable headerText = this.headerTexts.dashboard;

	_handleRestChoose = (option, del, menu) => {
		if (menu === true) {
			this.showMenuForm = true;
			this.showForm = false;
			this.menuId = null;
		} else if (del !== true) {
			this.restaurant = option !== null ? this.data.restaurants.find((elem, idx) => { return (elem.id === option.value) }) : option;
			this.showForm = true;
			this.showMenuForm = false;
		} else if (del === true) {
			this._delete(option);
		}
	}

	_delete = restaurant => {
		io.socket.delete('/restaurant/' + restaurant.value, resData => {
			this.restaurantIds.remove(restaurant.id);
			this.showForm = false;
		});
	}

	_handleSubmit = restaurant => {
		this.restaurant = restaurant;
		this.data.restaurants.push(restaurant);
		this.restaurantIds.push(restaurant.id);
		this.showForm = false;
	}

	_editMenu = id => {
		this.menuId = id;
		this.showMenuForm = true;
		this.showForm = false;
		this.showCategoryForm = false;
		this.category = null;
	}

	_handleDeleteMenu = id => {
		this.showMenuForm = false;
		this.showForm = true;
		this.menuId = null;
	}

	_handleMenuSubmit = menu => {
		this.showMenuForm = false;
		this.menuId = menu.id;
		this.menu = menu;
		const restaurantIndex = this.data.restaurants.findIndex(restaurant => { return restaurant.id === menu.restaurant.id; });
		const menuIndex = this.data[restaurantIndex].menus.findIndex(existingMenu => { return existingMenu.id === menu.id; });
		if (menuIndex === -1) { //new menu
			this.data[restaurantIndex].menus.push(menu);
		} else {
			this.data[restaurantIndex].menus[menuIndex] = menu;
		}
		this.showCategoryForm = true;
	}

	_handleCategorySubmit = category => {
		this.showCategoryForm = false;
		this.categoryId = category.id;
		this.category = category;
		this.showdishForm = true;
	}

	_handleDishSubmit = dish => {
		this.showdishForm = false;
		this.dishId = dish.id;
		this.dish = dish;
	}

	_editCategory = id => {
		this.categoryId = id;
		this.showMenuForm = false;
		this.showCategoryForm = true;
		this.showdishForm = false;
	}

	_editDish = id => {
		this.dishId = id;
		this.showCategoryForm = false;
		this.showdishForm = true;
	}

	_handleDeleteCategory = id => {
		this.showMenuForm = true;
		this.showCategoryForm = false;
		this.category = null;
		this.categoryId = null;
	}

	_handleAddCategory = () => {
		this.showCategoryForm = true;
		this.categoryId = null;
		this.category = null;
		this.showMenuForm = false;
	}

	_setActiveTab = name => {
		this.activeTab = name;
		this.headerText = this.headerTexts[name];
	}

	_handleRestCreate = () => {

	}

	_handleAddMenu = () => {

		this.showMenuPopup = true;
	}

	render() {
		const restForm = this.showForm === true ? <RestaurantForm restaurant={this.restaurant} submitCallback={this._handleSubmit} /> : null;
		const menuForm = this.showMenuForm === true ? <MenuForm menuId={this.menuId} restaurant={this.restaurant} submitCallback={this._handleMenuSubmit} /> : null;
		const categoryForm = this.showCategoryForm === true ? <CategoryForm menuId={this.menuId} categoryId={this.categoryId} category={this.category} submitCallback={this._handleCategorySubmit} /> : null;
		const dishForm = this.showdishForm === true ? <DishForm categoryId={this.categoryId} dishId={this.dishId} dish={this.dish} submitCallback={this._handleDishSubmit} /> : null;
		const header = this.data.restaurants.length > 0 ? <Header headerText={this.headerText} userData={this.userData} notifications={this.notifications} /> : null;
		const restPopup = this.data.restaurants.length === 0 ? <RestaurantPopup submitCallback={this._handleRestCreate} /> : null;
		const menuLayout = this.activeTab === 'menus' ? <MenuLayout menus={this.menus} noMenus={this.menus.length === 0} handleAddMenu={this._handleAddMenu} /> : null;
		return <ReactCSSTransitionGroup
			transitionName="example"
			transitionEnterTimeout={3500}
			transitionLeaveTimeout={3500}
			transitionAppear={true}
			transitionAppearTimeout={3500}>
			<AppNavigation active={this.activeTab} setActive={this._setActiveTab} />
			<div id="loginControl">
				<a href="/logout">Logout</a>
				<a href="/backoffice">BackOffice</a>
			</div>
			{/* <NavigationPane category={this.category} data={this.data} callBackRestChoose={this._handleRestChoose} callBackCategoryChoose={this._editCategory} callBackAddCategory={this._handleAddCategory}
					restaurantIds={this.restaurantIds} callBackMenuClick={this._editMenu} callBackMenuDelete={this._handleDeleteMenu} callBackCategoryDelete={this._handleDeleteCategory}
					callBackDishChoose={this._editDish} /> */}
			{header}
			{menuLayout}
			{restForm}
			{restPopup}
			{menuForm}
			{categoryForm}
			{dishForm}
		</ReactCSSTransitionGroup>;
	}
}

export default RestaurantView;