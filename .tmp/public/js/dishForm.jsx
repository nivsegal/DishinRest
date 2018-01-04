import React from 'react';
import ReactDOM from 'react-dom';
import { observable } from "mobx";
import { observer } from "mobx-react";
import TimePicker from 'rc-time-picker';
import moment from 'moment';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import ImageUploader from 'react-images-upload';

@observer class DishForm extends React.Component {

	constructor(props) {
		super(props);

		this._onDrop = this._onDrop.bind(this);
	}

	@observable title = '';
	@observable description = '';
	@observable titleErrMsg = [];
	@observable descriptionErrMsg = [];
	@observable dish = null;
	@observable images = [];

	componentWillReceiveProps(newProps) {
		const { dishId, dish } = newProps;
		if (dish === null) {
			this.title = '';
			this.description = '';
		} else if (dishId === null) {
			this._fetchDish(dishId);
		}
	}

	_fetchDish = id => {
		io.socket.get('/menuItem/' + id, (dish, jwres) => {
			if (jwres.statusCode !== 404) {
				this.title = dish.title;
				this.description = dish.description;
				this.dish = dish;
			}
		});
	}

	componentWillMount() {
		const { dishId, category } = this.props;
		if (dishId === null) {
			this.title = '';
			this.description = '';
		} else {
			this._fetchDish(dishId);
		}
	}

	_handleSubmit = e => {
		console.log('here');
		e.preventDefault();
		const { title, description } = this;
		let categoryId = this.props.categoryId;
		const categories = new Array(1).fill(categoryId);
		this.titleErrMsg = this.descriptionErrMsg = [];
		if (this._validate()) {
			if (this.dish === null) {
				io.socket.post('/menuItem/create', { title, description, categories }, (dish, jwres) => {
					this.props.submitCallback(dish);
				});
			} else { //update
				io.socket.post('/menuItem/' + this.dish.id, { title, description, categories }, (updated, res) => {
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

		if (this.description.length === 0) {
			this.descriptionErrMsg.push(emptyErrMsg)
		}

		if (this.titleErrMsg.length === 0 && this.descriptionErrMsg.length === 0)
			validated = true;

		return validated;
	}

	_handleTitleChange = e => {
		this.titleErrMsg.replace([]);
		this.title = e.currentTarget.value;
	}

	_handleDescriptionChange = e => {
		this.descriptionErrMsg.replace([]);
		this.description = e.currentTarget.value;
	}

	_onDrop(image){
		this.images = this.images.concat(image);
	}

	render() {
		const header = this.title.length > 0 ? <h4>Update Dish</h4> : <h4>Create Dish</h4>;
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
					<div className="red">{this.descriptionErrMsg}</div>
					<label htmlFor="description">Description</label>
					<input value={this.description} onChange={this._handleDescriptionChange} name="description" id="description" />
				</div>
				<div className="form-group">
					<button type="submit" className="btn btn-info btn-lg">
						Save &rarr;
						</button>
				</div>
			</form>
			<div className="form-group">
					<ImageUploader
						withIcon={true}
						buttonText='Choose images'
						onChange={this._onDrop}
						imgExtension={['.jpg', '.gif', '.png', '.gif']}
						maxFileSize={5242880}
					/>
				</div>
		</ReactCSSTransitionGroup>;
	}
}

export default DishForm;