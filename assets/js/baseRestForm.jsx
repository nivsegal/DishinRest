import React from 'react';
import ReactDOM from 'react-dom';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete';

@observer class BaseRestForm extends React.Component {

	constructor(props) {
		super(props);
	}

	@observable restName = '';
	@observable address = '';
	@observable description = '';
	@observable restNameErrMsg = [];
	@observable addressErrMsg = [];
	@observable descriptionErrMsg = [];
	@observable restaurant = this.props.restaurant;

	_setValue = e => {
		this[e.target.name] = e.target.value;
		const errMsg = e.target.name + 'ErrMsg';
		this[errMsg] = [];
	}

	_onChangeAddress = address => {
		this.address = address;
		this.addressErrMsg = [];
	}

	_onChangeRestName = name => {
		this.restName = name;
		this.restNameErrMsg = [];
	}

	render() {
		const inputPropsAddress = {
			value: this.address,
			onChange: this._onChangeAddress,
			dir: 'auto'
		},
			inputPropsName = {
				value: this.restName,
				onChange: this._onChangeRestName,
				dir: 'auto'
			},
			cssClasses = {
				root: 'autocompleteRoot',
				input: 'form-control'
			}

		return <div id="baseRestForm">
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
				<label><span>Description</span></label><textarea dir="auto" rows="10" name="description" value={this.description} onChange={this._setValue} className="form-control" ></textarea>
			</div>
		</div >;
	}
}

export default BaseRestForm;