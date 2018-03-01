import React from 'react';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

@observer class MenuPopup extends React.Component {
	constructor(props) {
		super(props);
	}

	@observable viewStage = 'basic';
	@observable title = ''; 


	_handleAddMenuClick = e => {
		this.props.handleAddMenu();
	}

	_handleTitleChange = e => {
		this.titleErrMsg.replace([]);
		this.title = e.currentTarget.value;
	}

	_closeLayer = () => {
		this.props.closePopup();
	}

	render() {
		const { menus, noMenus } = this.props;
		return <div id="popupFormContainer" className="menuPopupContainer">
				<ReactCSSTransitionGroup
					transitionName="example"
					transitionEnterTimeout={1500}
					transitionLeaveTimeout={1500}
					transitionAppear={true}
					transitionAppearTimeout={1500}>
					<h4>{this.viewStage === 'basic' ? 'CREATE A MENU' : 'EDIT MENU'}</h4>
					<div className="closeBtn" onClick={this._closeLayer}></div> 
					<form onSubmit={this._handleSubmit} id="menuForm">
						<label htmlFor="title">Title</label>
						<input value={this.title} onChange={this._handleTitleChange} name="title" id="title" />
						<button type="submit">{this.viewStage === 'basic' ? 'Add Menu' : 'Save Menu'}</button>
					</form>
				</ReactCSSTransitionGroup>
			</div>;
	}
}

export default MenuPopup;