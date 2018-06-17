import React from 'react';
import Dropzone from 'react-dropzone';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";
import TagsFilters from './tagsFilters.jsx';
import axios from 'axios';

@observer class DishPopup extends React.Component {
	constructor(props) {
		super(props);
	}

	@observable title = '';
	@observable description = '';
	@observable image = '';
	@observable fileName = '';
	@observable fileExtension = '';
	@observable price = '';
	@observable calories = '';
	@observable errorMsgs = [];
	@observable disabled = false;

	_handleAddMenuClick = e => {
		this.props.handleAddMenu();
	}

	_setValue = e => {
		this[e.target.name] = e.target.value;
		const errMsg = e.target.name + 'ErrMsg';
		this[errMsg] = [];
	}

	_handleTitleChange = e => {
		this.titleErrMsg.replace([]);
		this.title = e.currentTarget.value;
	}

	_closeLayer = () => {
		this.props.closePopup();
	}

	_handleFileChange = e => {
		this.image = e.target.files[0];
		// this.refs.form.getDOMNode().dispatchEvent(new Event("submit"));
	}

	_vallidateImage = image => {
		let validated = true;
		const allowedExtensionsArr = ['jpg', 'jpeg', 'png', 'bmp', 'gif', 'svg'];
		const extension = image.name.split('.')[1];
		if (allowedExtensionsArr.indexOf(extension) === -1) {
			validated = false;
			this.errorMsgs.push('This file must be an image');
		}

		if (image.size > 3000000) { //replace this shit
			validated = false;
			this.errorMsgs.push('Upload something smaller - Max size is 3MB');
		}

		return validated;
	}

	_handleSubmit = e => {
		e.preventDefault();
		const { title, description, image, calories, price } = this;
		const fileName = image.name;
		const restaurantId = this.props.restaurantId;
		io.socket.request({
			method: 'post',
			url: '/menuItem/createDish',
			data: { title, description, fileName, restaurantId, calories, price },
			headers: { credentials: 'include' }
		}, (imageUrl, jwres) => {
			// this.props.submitCallback(restaurant);
			console.log(imageUrl);
		});
	}

	onDrop = files => {
		this.image = null;
		const file = files[0];
		const isValidImage = this._vallidateImage(file);
		if (isValidImage) {
			const config = {
				headers: { 'Content-type': 'multipart/form-data', 'credentials': 'include', 'Cache-Control': 'no-store' }
			}
			const data = new FormData();
			data.append('fileName', file.name);
			data.append('dishImage', file); //have to send the image last - caveat from using Skipper on Sails

			axios.post('menuItem/upload', data, config).then(response => {
				setTimeout(() => { //The server puts the file in place but the re-render preceeds the file change
					this.image = file;
					if (response.data.fileName) {
						this.fileExtension = response.data.fileName.split('.').pop();
					}
				}, 1200);
			})
		}
	}

	render() {
		const { dish, tags } = this.props;
		const errMsgElement = this.errorMsgs.map((msg, key) => {
			return <div key={key} className="errorMsg">{msg}</div>;
		});
		const imagePreview = this.image ? <img id="dishPreview" src={`/uploads/${user.uid}/temp.${this.fileExtension}?${Date.now()}`} /> : null;
		return <div id="popupFormContainer" className="dishPopupContainer">
			<h4>{dish === null ? 'CREATE A DISH' : 'EDIT DISH'}</h4>
			<div className="closeBtn" onClick={this._closeLayer}></div>
			<form onSubmit={this._handleSubmit} id="dishForm" encType="multipart/form-data" ref="uploadForm">
				<div className="form-group">
					<label htmlFor="title"><span>Title</span></label>
					<input value={this.title} onChange={this._setValue} name="title" id="title" className="form-control" />
				</div>
				<TagsFilters tags={tags} />
				<div className="form-group">
					<label><span>Description</span></label>
					<textarea dir="auto" rows="6" name="description" value={this.description} onChange={this._setValue} className="form-control" ></textarea>
				</div>
				<div className="form-group">
					<label htmlFor="price"><span>Price</span></label>
					<input value={this.price} onChange={this._setValue} name="price" id="price" className="form-control" />
				</div>
				<div className="form-group">
					<label htmlFor="calories"><span>kCal</span></label>
					<input value={this.calories} onChange={this._setValue} name="calories" id="calories" className="form-control" />
				</div>
				<div className="form-group relative">
					<label><span>Upload image</span></label>
					<Dropzone name="dishImage" accept="image/jpeg, image/png" onDrop={this.onDrop} disabled={this.disabled}>
						<p>Drag a file or Browse</p>
					</Dropzone>
					{imagePreview}
				</div>
				<div id="errorMsgContainer">{errMsgElement}</div>
				<button type="submit">{dish === null ? 'Add Dish' : 'Save Dish'}</button>
			</form>
		</div>;
	}
}

export default DishPopup;