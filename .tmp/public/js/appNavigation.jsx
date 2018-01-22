import React from 'react';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";

@observer class AppNavigation extends React.Component {
	render() {
		const { active } = this.props;
		return <div id="dishinLeftStrip" className="navigationPane">
			<span id="dishinLogo"></span>
			<div id="appNavigation">
				<div>
					<span className="icon dashboard"></span>
					<span className="navTitle">Dashboard</span>
				</div>
				<div>
					<span className="icon menus"></span>
					<span className="navTitle">Menus</span>
				</div>
				<div>
					<span className="icon dishes"></span>
					<span className="navTitle">Dishes</span>
				</div>
			</div>
		</div>
	}
}

export default AppNavigation;