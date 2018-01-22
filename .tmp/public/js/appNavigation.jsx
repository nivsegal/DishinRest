import React from 'react';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";

@observer class AppNavigation extends React.Component {
	constructor(props) {
		super(props);
	}

	_setActive = e => {
		this.props.setActive(e.currentTarget.id);
	}

	render() {
		const { active } = this.props;
		return <div id="dishinLeftStrip" className="navigationPane">
			<span id="dishinLogo"></span>
			<div id="appNavigation">
				<div id="dashboard" className={active === 'dashboard' ? 'active' : ''} onClick={this._setActive}>
					<span className="icon dashboard"></span>
					<span className="navTitle">Dashboard</span>
				</div>
				<div id="menus" className={active === 'menus' ? 'active' : ''} onClick={this._setActive}>
					<span className="icon menus"></span>
					<span className="navTitle">Menus</span>
				</div>
				<div id="dishes" className={active === 'dishes' ? 'active' : ''} onClick={this._setActive}>
					<span className="icon dishes"></span>
					<span className="navTitle">Dishes</span>
				</div>
			</div>
		</div>
	}
}

export default AppNavigation;