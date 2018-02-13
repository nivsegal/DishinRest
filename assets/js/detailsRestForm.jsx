import React from 'react';
import ReactDOM from 'react-dom';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import $ from 'jquery';
import ionRangeSlider from 'ion-rangeslider';

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
	@observable activeDays = new Array(this.days.length).fill(true);

	componentWillMount() {
		this._initHours();
	}

	componentDidMount() {
		$("input[name^='hourRange_']").ionRangeSlider({
			type: "double",
			min: +moment().hour(6).minute(0).format("X"),
			max: +moment().add(1, "day").hour(5).minute(0).format("X"),
			from: +moment().hour(10).minute(0).format("X"),
			to: +moment().add(1, "day").hour(0).minute(0).format("X"),
			hide_min_max: true,
			step: 1800,
			prettify: num => {
				var m = moment(num, "X");
				return m.format("HH:mm");
			},
			onChange: data => {
				const index = data.input[0].name.slice(-1);
				this.hours[index] = { start: moment(data.from), end: moment(data.to)};
				this.props.setActivityHours(this.hours);
			},
		});
	}

	_handleCheckboxChange = (e, index) => {
		const { checked, value } = e.currentTarget;
		if (checked === true)
			this.tagsChosen[index] = true;
		else
			this.tagsChosen[index] = false;

		this.props.setTags(this.tagsChosen);
	}

	_initHours = () => {
		this.hours.replace([]);
		this.days.map((day, index) => {
			const times = { start: moment().hour(12).minute(0), end: moment().hour(0).minute(0) };
			this.hours.push(times);
		});
	}

	_toggleSlider = (e, index) => {
		this.activeDays[index] = !this.activeDays[index];
		var slider = $('#hourRange_' + index).data("ionRangeSlider");
		slider.update({ disable: !this.activeDays[index] });
		if (this.activeDays[index] === true) //means the click disabled the day
			this.hours.remove(this.hours[index]);
	}

	render() {
		const openingHours = this.days.map((day, index) => {
			return <div className="form-group" key={index}><span className={this.activeDays[index] === true ? 'day on' : 'day'} onClick={(e) => { this._toggleSlider(e, index) }}>{day.substr(0, 3).toUpperCase()}</span>
				<div className="sliderContainer"><input id={'hourRange_' + index} type="text" value="" name={'hourRange_' + index} /></div>
			</div>
		});
		return <div id="detailsRestForm" className={this.props.className}>
			<div className="form-group">
				<label><span className="header">Tags</span></label>
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
				<div className="clear"></div>
			</div>
			<div id="activityHoursContainer"><div className="form-group"><span className="header">Activity Hours</span></div>{openingHours}</div>
		</div >;
	}
}

export default DetailsRestForm;