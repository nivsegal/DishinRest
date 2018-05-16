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
	@observable menuTitle = '';
	@observable titleErrMsg = [];
	@observable menu = null;
	@observable menuTitleEditable = false;

	_normalizeHours = () => {
		return { start: moment.utc(this.start), end: moment.utc(this.end) }
	}

	componentWillReceiveProps(newProps) {
		const { menuId, restaurant, menus } = newProps;
		if (menuId === null) {
			this.title = '';
			this.hours = { start: moment().hour(12).minute(0), end: moment().hour(0).minute(0) };
		} else {
			menus.map(menu => {
				if (menu.id === menuId) {
					this.menu = menu;
					this.menuTitle = menu.title;
					// this.hours = { start: moment(menu.hours.start), end: moment(menu.hours.end) };
				}
			});
		}
	}

	componentWillMount() {
		const { menuId, menus } = this.props;
		if (menuId !== null) {
			menus.map(menu => {
				if (menu.id === menuId) {
					this.menu = menu;
					this.menuTitle = menu.title;
					// this.hours = { start: moment(menu.hours.start), end: moment(menu.hours.end) }; 
				}
			});
		}
	}

	_handleSubmit = e => {
		e.preventDefault();
		const { menuTitle } = this;
		const hours = this._normalizeHours();
		let restaurantId = this.props.restaurant.id;
		const restaurant = restaurantId;
		if (this._validate()) {
			if (this.menu === null) {
				io.socket.post('/menu/create', { menuTitle, restaurant }, (menu, jwres) => {
					this.props.submitCallback(menu);
				});
			} else { //update
				io.socket.post('/menu/' + this.menu.id, { menuTitle, hours, restaurant }, (updated, res) => {
					this.props.submitCallback(updated);
				});
			}
			this.menuTitleEditable = false;
		}
		return false;
	}

	_validate = () => {
		const emptyErrMsg = 'This value cannot be empty';
		let validated = false;
		this.titleErrMsg.replace([]);
		if (this.menuTitle.length === 0) {
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
		this.menuTitle = e.currentTarget.value;
	}

	_enableEditing = (element, e) => {
		console.log(element);
		this[element + 'Editable'] = true;
	}

	render() {
		const header = this.menuTitle.length > 0 ? <h4>Update Menu</h4> : <h4>Create Menu</h4>;

		const title = this.menuTitle.length === 0 || this.menuTitleEditable === true ? <div><div className="red">{this.titleErrMsg}</div>
			<input value={this.menuTitle} onChange={this._handleTitleChange} name="menuTitle" id="menuTitle" placeholder="Menu Title (e.g., Breakfast Menu)" /></div>
			: <h3 name="menuTitle" onClick={(e) => this._enableEditing('menuTitle', e)}>{this.menuTitle}</h3>;

		return <ReactCSSTransitionGroup
			transitionName="example"
			transitionEnterTimeout={1500}
			transitionLeaveTimeout={1500}
			transitionAppear={true}
			transitionAppearTimeout={1500}>
			{/* {header} */}
			<form onSubmit={this._handleSubmit} id="menuForm" onBlur={this._handleSubmit} >
				{title}
				<div className="form-group">
					{/* <div className="form-group"><div>Active Hours</div>
						<span className="inline">From</span>
						<TimePicker value={this.hours.start} className="hours" onChange={e => { this._onTimeChange('start', e) }} format={this.format} showSecond={false} />
						<span className="inline">To</span>
						<TimePicker value={this.hours.end} className="hours" onChange={e => { this._onTimeChange('end', e) }} format={this.format} showSecond={false} />
					</div> */}
				</div>
			</form>
		</ReactCSSTransitionGroup>;
	}
}

export default MenuForm;