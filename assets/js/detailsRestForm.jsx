import React from 'react';
import ReactDOM from 'react-dom';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";
import TimePicker from 'rc-time-picker';
import moment from 'moment';

@observer class DetailsRestForm extends React.Component {

	constructor(props) {
		super(props);
		this.now = moment().hour(0).minute(0);
		this.days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	}

	@observable restaurant = this.props.restaurant;
	@observable hours = [];
	@observable tags = [];
	@observable tagsChosen = [];

	componentWillMount() {
		this._initHours();
	}

	_handleCheckboxChange = (e, index) => {
		const { checked, value } = e.currentTarget;
		if (checked === true)
			this.tagsChosen[index] = true;
		else
			this.tagsChosen[index] = false;
	}

	_initHours = () => {
		this.hours.replace([]);
		this.days.map((day, index) => {
			const times = { start: moment().hour(12).minute(0), end: moment().hour(0).minute(0) };
			this.hours.push(times);
		});
	}

	render() {
		const openingHours = this.days.map((day, index) => {
			return <div className="form-group" key={index}><span className="day">{day}: </span>
				<span className="inline">From</span> <TimePicker popupClassName="hoursPopup" className="hours"
					onChange={e => { this._onTimeChange(index, 'start', e) }} format={this.format} showSecond={false} name={'days[' + index + '][start]'}
					value={this.hours[index]['start']} />
				<span className="inline">To</span> <TimePicker popupClassName="hoursPopup" value={this.hours[index]['end']} className="hours" onChange={e => { this._onTimeChange(index, 'end', e) }}
					format={this.format} showSecond={false} name={'days[' + index + '][end]'} />
			</div>;
		});
		return <div id="detailsRestForm">
			<div className="form-group"><span>Opening Hours</span></div>{openingHours}
			<div className="form-group">
				<label><span>Tags: </span></label>
				<ul>{this.props.tags.map((tag, key) => {
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
		</div >;
	}
}

export default DetailsRestForm;