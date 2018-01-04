import React from 'react';
import ReactDOM from 'react-dom';
import { observable } from "mobx";
import { observer } from "mobx-react";
import Select from 'react-select';

@observer class NavigationPane extends React.Component {

	constructor(props) {
		super(props);
	}

	@observable restaurants = this.props.data;
	@observable options = [];
	@observable menuOptions = [];
	@observable categoryOptions = [];
	@observable dishOptions = [];
	@observable selectedVal = '';
	@observable selectedMenuVal = '';
	@observable selectedCategoryVal = '';
	@observable selectedDishVal = '';
	@observable displayMenuOption = false;
	@observable showDeleteRestaurant = true;
	@observable showCreateRestButton = true;
	@observable displayCategoryOption = false;
	@observable displayDishOption = false;

	_handleRestChoose = value => {
		this.selectedVal = value;
		this.displayMenuOption = true;
		this.menuOptions = [];
		this._getMenuOptions();
		this.props.callBackRestChoose(value);
	}

	_handleMenuChoose = option => {
		this.selectedMenuVal = option;
		this.selectedCategoryVal = '';
		this.displayMenuOption = true;
		this.displayCategoryOption = true;
		this.categoryOptions = [];
		this._getCategoryOptions();
		this.props.callBackMenuClick(option.value, true);
	}

	_getCategoryOptions = () => {
		const index = this.restaurants.findIndex((elem, ind) => { return (elem.id === this.selectedVal.value) });
		const menu = this.restaurants[index].menus.find(menu => { return menu.id === this.selectedMenuVal.value });
		this._fetchCategories(menu.id);
	}

	_fetchCategories = menuId => {
		this.categoryOptions = [];
		io.socket.get('/menu/' + menuId + '/categories', (categories, jwres) => {
			categories.map(category => {
				this.categoryOptions.push({ label: category.title, value: category.id });
			})
		});

	}

	_fetchDishes = categoryId => {
		io.socket.get('/menuCategory/' + categoryId + '/dishes', (dishes, jwres) => {
			dishes.map(dish => {
				this.dishOptions.push({ label: dish.title, value: dish.id });
			})
		});
	}

	_getMenuOptions = () => {
		const index = this.restaurants.findIndex((elem, ind) => { return (elem.id === this.selectedVal.value) });
		this.restaurants[index].menus.map(menu => {
			this.menuOptions.push({ label: menu.title, value: menu.id });
		})
	}

	componentWillMount() {
		this.restaurants.map(restaurant => {
			this.options.push({ label: restaurant.restName, value: restaurant.id });
		})
	}

	_handleDeleteClick = () => {
		if (this.selectedVal !== '') {
			const index = this.restaurants.findIndex((elem, ind) => { return (elem.id === this.selectedVal.value) });
			this.props.callBackRestChoose(this.selectedVal, true);
			this.restaurants.splice(index, 1);
			this.options.splice(index, 1);
			this.selectedVal = '';
		} else {
			alert('You have to choose a restaurant to delete');
		}
	}

	componentWillReceiveProps(newProps) {
		this.restaurants = newProps.data;
		this.options = this.menuOptions = [];
		this.restaurants.map(restaurant => {
			this.options.push({ label: restaurant.restName, value: restaurant.id });
			restaurant.menus.map(menu => {
				this.menuOptions.push({ label: menu.title, value: menu.id });
			});
		});

		const { category } = newProps;
		if (category !== null) {
			const index = this.categoryOptions.findIndex(option => { return option.value === category.id });
			const newVal = { label: category.title, value: category.id };
			if (index === -1)
				this.categoryOptions.push(newVal);
			else
				this.categoryOptions[index] = newVal;

			this.selectedCategoryVal = newVal;
		} else {

		}
	}

	_handleCreate = e => {
		this.selectedVal = '';
		this.props.callBackRestChoose(null);
	}

	_displayMenuForm = e => {
		this.showDeleteRestaurant = false;
		this.showCreateRestButton = false;

		this.props.callBackRestChoose(null, null, true);
	}

	_handleMenuClick = id => {

	}

	_handleDeleteMenuClick = () => {
		const index = this.restaurants.findIndex((elem, ind) => { return (elem.id === this.selectedVal.value) });
		const menuIdx = this.restaurants[index].menus.findIndex((elem, ind) => { return (elem.id === this.selectedMenuVal.value) });
		this.restaurants[index].menus.splice(menuIdx, 1);
		this.menuOptions.splice(menuIdx, 1);
		this._deleteMenuFRomDB(this.selectedMenuVal.value);
	}

	_deleteMenuFRomDB = id => {
		io.socket.delete('/menu/' + id, resData => {
			this.selectedMenuVal = '';
			this.props.callBackMenuDelete(id);
		});
	}

	_handleCategoryChoose = option => {
		this.selectedCategoryVal = option;
		this._getCategoryOptions();
		this.displayDishOption = true;
		this.dishOptions = [];
		this._fetchDishes(option.value);
		this.props.callBackCategoryChoose(option.value);
	}

	_handleDishChoose = option => {
		this.selectedDishVal = option;
		this.props.callBackDishChoose(option.value);
	}

	_handleDeleteCategoryClick = () => {
		this._deleteCategoryFromDB(this.selectedCategoryVal.value);
	}

	_handleDeleteDishClick = () => {
		this._deleteDishFromDB(this.selectedDishVal.value);
	}

	_deleteCategoryFromDB = id => {
		io.socket.delete('/menuCategory/' + id, resData => {
			const index = this.categoryOptions.findIndex(option => { return option.value === this.selectedCategoryVal.value });
			this.categoryOptions.splice(index, 1);
			this.selectedCategoryVal = '';
			this.props.callBackCategoryDelete(id);
		});
	}

	_deleteDishFromDB = id => {
		io.socket.delete('/menuItem/' + id, resData => {
			const index = this.dishOptions.findIndex(option => { return option.value === this.selectedDishVal.value });
			this.dishOptions.splice(index, 1);
			this.selectedDishVal = '';
			this.props.callBackDishDelete(id);
		});
	}

	_displayCategoryForm = () => {
		this.selectedCategoryVal = '';
		this.props.callBackAddCategory();
	}

	_displayDishForm = () => {
		this.selectedDishVal = '';
		this.props.callBackAddDish();
	}

	render() {
		const createButton = this.showCreateRestButton === true ? <button id="createRest" onClick={this._handleCreate} type="button" className="btn btn-outline-primary" aria-label="Create">
			<span className="glyphicon glyphicon-remove" aria-hidden="true">Create</span>
		</button> : null;
		const deleteButton = this.restaurants.length > 0 && this.showDeleteRestaurant === true ?
			<button onClick={this._handleDeleteClick} type="button" className="btn btn-outline-primary" aria-label="Delete">
				<span className="glyphicon glyphicon-remove" aria-hidden="true">Delete Restaurant</span>
			</button> : null;
		const addMenuButton = this.displayMenuOption === true ? <button onClick={this._displayMenuForm} type="button" className="btn btn-outline-primary" aria-label="Create">
			<span className="glyphicon glyphicon-plus" aria-hidden="true">Add Menu</span>
		</button> : null;
		const addCategoryButton = this.displayCategoryOption === true ? <button onClick={this._displayCategoryForm} type="button" className="btn btn-outline-primary" aria-label="Create">
			<span className="glyphicon glyphicon-plus" aria-hidden="true">Add Category</span>
		</button> : null;
		const addDishButton = this.displayDishOption === true ? <button onClick={this._displayDishForm} type="button" className="btn btn-outline-primary" aria-label="Create">
			<span className="glyphicon glyphicon-plus" aria-hidden="true">Add Dish</span>
		</button> : null;
		const deleteMenuButton = this.selectedMenuVal !== '' ? <button onClick={this._handleDeleteMenuClick} type="button" className="btn btn-outline-primary" aria-label="Delete">
			<span className="glyphicon glyphicon-remove" aria-hidden="true">Delete Menu</span>
		</button> : null;
		const deleteCategoryButton = this.selectedCategoryVal !== '' ? <button onClick={this._handleDeleteCategoryClick} type="button" className="btn btn-outline-primary" aria-label="Delete">
			<span className="glyphicon glyphicon-remove" aria-hidden="true">Delete Category</span>
		</button> : null;
		const deleteDishButton = this.selectedDishVal !== '' ? <button onClick={this._handleDeleteDishClick} type="button" className="btn btn-outline-primary" aria-label="Delete">
			<span className="glyphicon glyphicon-remove" aria-hidden="true">Delete Dish</span>
		</button> : null;

		const menuDropDown = this.selectedVal !== '' ? <Select name="menus" value={this.selectedMenuVal} options={this.menuOptions.slice()} onChange={this._handleMenuChoose} /> : null;
		const categoryDropDown = this.selectedMenuVal !== '' ? <Select name="category" value={this.selectedCategoryVal} options={this.categoryOptions.slice()} onChange={this._handleCategoryChoose} /> : null;
		const dishDropDown = this.selectedCategoryVal !== '' ? <Select name="dish" value={this.selectedDishVal} options={this.dishOptions.slice()} onChange={this._handleDishChoose} /> : null;

		const munusTitle = menuDropDown !== null ? <h4>Menus</h4> : null;
		const categoryTitle = categoryDropDown !== null ? <h4>Categories</h4> : null;
		const dishTitle = dishDropDown !== null ? <h4>Dishes</h4> : null;

		return <div id="navigationPane">
			<h4>Restaurants</h4>
			<Select
				name="restaurants"
				value={this.selectedVal}
				options={this.options.slice()}
				onChange={this._handleRestChoose}
			/>
			<div className="buttons">
				{createButton}
				{deleteButton}
			</div>
			{munusTitle}
			{menuDropDown}
			<div className="buttons">
				{addMenuButton}
				{deleteMenuButton}
			</div>
			{categoryTitle}
			{categoryDropDown}
			<div className="buttons">
				{addCategoryButton}
				{deleteCategoryButton}
			</div>
			{dishTitle}
			{dishDropDown}
			<div className="buttons">
				{addDishButton}
				{deleteDishButton}
			</div>
		</div>
	}
}

export default NavigationPane;