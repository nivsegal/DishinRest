import React from 'react';
import ReactDOM from 'react-dom';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';
import BaseRestForm from './baseRestForm.jsx';
import DetailsRestForm from './detailsRestForm.jsx';

@observer class RestaurantPopup extends React.Component {

	constructor(props) {
		super(props);
		this.format = 'h:mm a';
	}

	@observable restName = '';
	@observable address = '';
	@observable description = '';
	@observable restNameErrMsg = [];
	@observable addressErrMsg = [];
	@observable descriptionErrMsg = [];
	@observable hours = [];
	@observable tags = [];
	@observable tagsChosen = [];
	@observable restaurant = null;
	@observable viewStage = 'basic';

	_setValue = e => {
		this[e.target.name] = e.target.value;
		const errMsg = e.target.name + 'ErrMsg';
		this[errMsg] = [];
	}

	componentWillMount() {
		this._getTags();
	}

	_getTags = () => {
		io.socket.get('/tag?restaurant=true', (resData, jwres) => {
			if (jwres.statusCode === 200) {
				this.tags.replace(resData);
				this.tagsChosen = new Array(this.tags.length).fill(false);
			}
		});
	}

	_initValues = () => {
		this.restName = this.address = this.description = '';
		this.tagsChosen = new Array(this.tags.length).fill(false);
		this._initHours();
	}

	_setWorkingHours = hoursArr => {
		this.hours = [];
		hoursArr.map((day, index) => {
			const times = { start: moment(day.start), end: moment(day.end) };
			this.hours.push(times);
		});
	}

	_initHours = () => {
		this.hours.replace([]);
		this.days.map((day, index) => {
			const times = { start: moment().hour(12).minute(0), end: moment().hour(0).minute(0) };
			this.hours.push(times);
		});
	}

	_onTimeChange = (index, which, e) => {
		this.hours[index][which] = e;
	}

	_normalizeHours = () => {
		let normalizedHours = [];
		this.hours.map((obj, ind) => {
			normalizedHours.push({ start: moment.utc(obj.start), end: moment.utc(obj.end) });
		});

		return normalizedHours;
	}

	_handleSubmit = e => {
		e.preventDefault();
		if (this.viewStage === 'basic') {
			this.viewStage = 'details';
			return false;
		}
		const { restName, address, description, tagsChosen } = this;
		const tags = this.tags.filter((tag, ind) => { return this.tagsChosen[ind] === true });
		const hours = this._normalizeHours();
		let restaurantId = -1;
		if (this._validate()) {
			if (this.restaurant === null) {
				io.socket.post('/restaurant/create', { restName, address, tags, description, hours }, (restaurant, jwres) => {
					restaurantId = restaurant.id;
					io.socket.post('/restaurant/' + restaurantId, { 'tags': tags }, (updated, res) => {
						this.props.submitCallback(updated);
					})
				});
			} else {
				io.socket.put('/restaurant/' + this.restaurant.id, { restName, address, tags, description, hours }, (updated, res) => {
					console.log(updated);
				});
			}
		}
		return false;
	}

	_validate = () => {
		const emptyErrMsg = 'This value cannot be empty';
		let validated = false;

		if (this.restName.length === 0) {
			this.restNameErrMsg.push(emptyErrMsg)
		}
		if (this.address.length === 0) {
			this.addressErrMsg.push(emptyErrMsg)
		}
		if (this.description.length === 0) {
			this.descriptionErrMsg.push(emptyErrMsg)
		}

		if (this.restNameErrMsg.length === 0 && this.addressErrMsg.length === 0 && this.descriptionErrMsg.length === 0)
			validated = true;

		return validated;
	}

	_onChangeAddress = address => {
		this.address = address;
		this.addressErrMsg = [];
	}

	_onChangeRestName = name => {
		this.restName = name;
		this.restNameErrMsg = [];
	}

	_handleCheckboxChange = (e, index) => {
		const { checked, value } = e.currentTarget;
		if (checked === true)
			this.tagsChosen[index] = true;
		else
			this.tagsChosen[index] = false;
	}

	_goBack = () => {
		this.viewStage = 'basic';
		return false;
	}

	render() {
		const inputPropsAddress = {
			value: this.address,
			onChange: this._onChangeAddress
		},
			inputPropsName = {
				value: this.restName,
				onChange: this._onChangeRestName
			},
			cssClasses = {
				root: 'autocompleteRoot',
				input: 'form-control'
			}
		const currentForm = this.viewStage === 'basic' ? <BaseRestForm /> : <DetailsRestForm tags={this.tags} tagsChosen={this.tagsChosen} />;
		const backBtn = this.viewStage === 'details' ? <button onClick={this._goBack}>
			<span className="glyphicon glyphicon-arrow-left"></span>Back</button> : null;
		return <div id="content" className={this.viewStage === 'basic' ? '' : 'details'}>
			<div id="popupFormContainer" className={this.viewStage === 'basic' ? '' : 'details'}>
				<ReactCSSTransitionGroup
					transitionName="example"
					transitionEnterTimeout={8500}
					transitionLeaveTimeout={8500}
					transitionAppear={true}
					transitionAppearTimeout={8500}>
					<h4>{this.viewStage === 'basic' ? 'CREATE A RESTAURANT' : 'RESTAURANT DETAILS'}</h4>
					<form onSubmit={this._handleSubmit} id="restForm">
						{currentForm}
						{backBtn}
						<button type="submit">{this.viewStage === 'basic' ? 'Save and Go to Details' : 'Create Restaurant'}</button>
					</form>
				</ReactCSSTransitionGroup>
			</div>
		</div >;
	}
}

export default RestaurantPopup;