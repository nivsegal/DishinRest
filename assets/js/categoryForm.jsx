import React from 'react';
import ReactDOM from 'react-dom';
import { observable } from "mobx";
import { observer } from "mobx-react";
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

@observer class CategoryForm extends React.Component {

	constructor(props) {
		super(props);

		this.format = 'h:mm a';
	}

	@observable hours = { start: moment().hour(12).minute(0), end: moment().hour(0).minute(0) };
	@observable title = '';
	@observable titleErrMsg = [];
	@observable category = null;

	_normalizeHours = () => {
		return { start: moment.utc(this.start), end: moment.utc(this.end) }
	}

	componentWillReceiveProps(newProps) {
		const { categoryId, category } = newProps;
		this.hours = { start: moment().hour(12).minute(0), end: moment().hour(0).minute(0) };
		if (category !== null) {
			this.title = category.title;
		} else if (categoryId === null) {
			this.title = '';
		} else {
			this._fetchCategory(categoryId);
		}
	}

	componentWillMount() {
		const { category, categoryId } = this.props;
		if (categoryId !== null) {
			this._fetchCategory(categoryId);
		}
	}

	_fetchCategory(categoryId) {
		io.socket.get('/menuCategory/' + categoryId, (category, jwres) => {
			if (jwres.statusCode !== 404) {
				this.title = category.title;
				this.hours = { start: moment(category.hours.start), end: moment(category.hours.end) };
				this.category = category;
			}
		});
	}

	_handleSubmit = e => {
		e.preventDefault();
		const { title } = this;
		const hours = this._normalizeHours();
		const menu = this.props.menuId;
		if (this._validate()) {
			if (this.category === null) {
				io.socket.post('/menuCategory/create', { title, hours, menu }, (category, jwres) => {
					this.props.submitCallback(category);
				});
			} else { //update
				io.socket.post('/menuCategory/' + this.category.id, { title, hours, menu }, (updated, res) => {
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
		const header = this.title.length > 0 ? <h4>Update Category</h4> : <h4>Create Category</h4>;
		return <ReactCSSTransitionGroup
			transitionName="example"
			transitionEnterTimeout={3500}
			transitionLeaveTimeout={3500}
			transitionAppear={true}
			transitionAppearTimeout={3500}>
			{header}
			<form onSubmit={this._handleSubmit} id="categoryForm">
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
						Save and Go to Dishes &rarr;
						</button>
				</div>
			</form>
		</ReactCSSTransitionGroup>;
	}
}

export default CategoryForm;