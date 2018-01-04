import React from 'react';
import ReactDOM from 'react-dom';
import { observable } from "mobx";
import { observer } from "mobx-react";
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

@observer class MenuForm extends React.Component {

	constructor(props) {
		super(props);

		this.format = 'h:mm a';
	}

	@observable hours = { start: moment().hour(12).minute(0), end: moment().hour(0).minute(0) };
	@observable title = '';
	@observable titleErrMsg = [];
	@observable menu = null;

	_normalizeHours = () => {
		return { start: moment.utc(this.start), end: moment.utc(this.end) }
	}

	componentWillReceiveProps(newProps) {
		const { menuId, restaurant } = newProps;
		if(menuId === null) {
			this.title = '';
			this.hours = { start: moment().hour(12).minute(0), end: moment().hour(0).minute(0) };
		} else {
			restaurant.menus.map( menu => {
				if(menu.id === menuId) {
					this.menu = menu;
					this.title = menu.title;
					this.hours = { start: moment(menu.hours.start), end: moment(menu.hours.end) };
				}
			});
		}
	}

	componentWillMount() {
		const menuId = this.props.menuId;
		this.props.restaurant.menus.map( menu => {
			if(menu.id === menuId) {
				this.menu = menu;
				this.title = menu.title;
				this.hours = { start: moment(menu.hours.start), end: moment(menu.hours.end) };
			}
		});
	}

	_handleSubmit = e => {
		e.preventDefault();
		const { title } = this;
		const hours = this._normalizeHours();
		let restaurantId = this.props.restaurant.id;
		const restaurant = restaurantId;
		if (this._validate()) {
			if(this.menu === null){
				io.socket.post('/menu/create', { title, hours, restaurant }, (menu, jwres) => {
					this.props.submitCallback(menu);
				});
			} else { //update
				io.socket.post('/menu/' + this.menu.id, { title, hours, restaurant }, (updated, res) => {
					this.props.submitCallback(updated);
				});
			}
		}
		return false;
	}

	_validate = () => {
		const emptyErrMsg = 'This value cannot be empty';
		let validated = false;

		if (this.title.length === 0) {
			this.titleErrMsg.push(emptyErrMsg)
		}

		if (this.titleErrMsg.length === 0)
			validated = true;

		return validated;
	}

	_onTimeChange = (which, e) => {
		this.hours[which] = e;
	}

	_handleTitleChange = e => {
		this.titleErrMsg.replace([]);
		this.title = e.currentTarget.value;
	}

	render() {
		const header = this.title.length > 0 ? <h4>Update Menu</h4> : <h4>Create Menu</h4>;
		return <ReactCSSTransitionGroup
			transitionName="example"
			transitionEnterTimeout={3500}
			transitionLeaveTimeout={3500}
			transitionAppear={true}
			transitionAppearTimeout={3500}>
			{header}
			<form onSubmit={this._handleSubmit} id="menuForm">
				<div className="red">{this.titleErrMsg}</div>
				<label htmlFor="title">Title</label>
				<input value={this.title} onChange={this._handleTitleChange} name="title" id="title" />
				<div className="form-group">
					<div className="form-group"><div>Active Hours</div>
						<span className="inline">From</span>
						<TimePicker value={this.hours.start} className="hours" onChange={e => { this._onTimeChange('start', e) }} format={this.format} showSecond={false} />
						<span className="inline">To</span>
						<TimePicker value={this.hours.end} className="hours" onChange={e => { this._onTimeChange('end', e) }} format={this.format} showSecond={false} />
					</div>
				</div>
				<div className="form-group">
					<button type="submit" className="btn btn-info btn-lg">
						Save and Go to Categories &rarr;
						</button>
				</div>
			</form>
		</ReactCSSTransitionGroup>;
	}
}

export default MenuForm;