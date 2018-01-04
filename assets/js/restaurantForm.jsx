import React from 'react';
import ReactDOM from 'react-dom';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

@observer class RestaurantForm extends React.Component {

	constructor(props) {
		super(props);
		this.now = moment().hour(0).minute(0);
		this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
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
	@observable restaurant = this.props.restaurant;

	_setValue = e => {
		this[e.target.name] = e.target.value;
		const errMsg = e.target.name + 'ErrMsg';
		this[errMsg] = [];
	}

	componentWillMount() {
		this._getTags();
		this._initHours();
		if (this.restaurant !== null)
			this._initValues();
	}

	componentWillReceiveProps(newProps) {
		this.restaurant = newProps.restaurant;
		this._initValues();
		if (this.restaurant !== null) {
			const tagsIdsFromDB = this.restaurant.tags.map(tag => tag.id);
			this.tagsChosen = new Array(this.tags.length).fill(false);
			this.tags.map((tag, ind) => {
				if (tagsIdsFromDB.includes(tag.id) === true) {
					this.tagsChosen[ind] = true;
				}
			});
		}
	}

	componentWillRender() {
		console.log('why not');
	}

	_getTags = () => {
		io.socket.get('/tag?restaurant=true', (resData, jwres) => {
			if (jwres.statusCode === 200) {
				this.tags.replace(resData);
				this.tagsChosen = new Array(this.tags.length).fill(false);
				if (this.restaurant !== null) {
					const tagsIdsFromDB = this.restaurant.tags.map(tag => tag.id);
					this.tags.map((tag, ind) => {
						if (tagsIdsFromDB.includes(tag.id) === true) {
							this.tagsChosen[ind] = true;
						}
					});
				}
			}
		});
	}

	_initValues = () => {
		if (this.restaurant !== null) {
			this.restName = this.restaurant.restName;
			this.address = this.restaurant.address;
			this.description = this.restaurant.description;
			this._setWorkingHours(this.restaurant.hours);
		} else {
			this.restName = this.address = this.description = '';
			this.tagsChosen = new Array(this.tags.length).fill(false);
			this._initHours();
		}
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

		const openingHours = this.days.map((day, index) => {
			return <div className="form-group" key={index}><span className="day">{day}: </span>
				<span className="inline">From</span> <TimePicker popupClassName="hoursPopup" className="hours"
					onChange={e => { this._onTimeChange(index, 'start', e) }} format={this.format} showSecond={false} name={'days[' + index + '][start]'}
					value={this.hours[index]['start']} />
				<span className="inline">To</span> <TimePicker popupClassName="hoursPopup" value={this.hours[index]['end']} className="hours" onChange={e => { this._onTimeChange(index, 'end', e) }}
					format={this.format} showSecond={false} name={'days[' + index + '][end]'} />
			</div>;
		});
		return <div id="formContainer">
			<ReactCSSTransitionGroup
				transitionName="example"
				transitionEnterTimeout={3500}
				transitionLeaveTimeout={3500}
				transitionAppear={true}
				transitionAppearTimeout={3500}>
				<h4>{this.restaurant === null ? 'CREATE A NEW RESTAURANT' : 'Update the Restaurant'}</h4>
				<div id="rightStripTop"></div>
				<div id="bottomRightScript"></div>
				<form onSubmit={this._handleSubmit} id="restForm">
					<div id="leftStrip"></div>
					<div className="red">{this.restNameErrMsg}</div>
					<div className="form-group name">
						<label><span>Restaurant Name</span></label><PlacesAutocomplete inputProps={inputPropsName} classNames={cssClasses} />
					</div>
					<div className="red">{this.addressErrMsg}</div>
					<div className="form-group">
						<label><span>Adress</span></label><PlacesAutocomplete inputProps={inputPropsAddress} classNames={cssClasses} />
					</div>
					<div className="red">{this.descriptionErrMsg}</div>
					<div className="form-group">
						<label><span>Description</span></label><textarea rows="10" name="description" value={this.description} onChange={this._setValue} className="form-control" ></textarea>
					</div>
					<div className="form-group"><span>Opening Hours</span></div>{openingHours}
					<div className="form-group">
						<label><span>Tags: </span></label>
						<ul>{this.tags.map((tag, key) => {
							return <li key={key} className="tag"> 
								<div className="styledCheckbox">
									<input type="checkbox" value="1"
										checked={key >= this.tagsChosen.length ? false : this.tagsChosen[key]}
										id={key} name="" onChange={(e) => { this._handleCheckboxChange(e, key) }} />
									<label htmlFor={key}>{tag.name}</label>
								</div>
							</li>
						})}
						</ul>
					</div>
					<button type="submit">
						Save and Go to Menu
						</button>
				</form>
			</ReactCSSTransitionGroup>
		</div >;
	}
}

export default RestaurantForm;