import React from 'react';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";

@observer class Header extends React.Component {
	constructor(props) {
		super(props);

		this._getProfilePicSrc();
	}

	@observable profilePicSrc = '';

	_getProfilePicSrc = () => {
		let src = '';
		const provider = this.props.userData.provider;
		switch (provider) {
			case 'facebook':
				this.profilePicSrc = '//graph.facebook.com/' + this.props.userData.uid + '/picture';
				break;
			case 'twitter':
				const userName = this.props.email.split('@')[0]; //username is stored in email
				this.profilePicSrc = 'https://twitter.com/' + userName + '/profile_image?size=original';
				break;
			case 'instagram':
				break;
			case 'google':
				break;
			default:
				break;
		}
	}

	render() {
		return <div id="header">
			<span className="headerText">{this.props.headerText}</span>
			<div id="userAreaContainer">
				<a href="#">
					<img src={this.profilePicSrc} />
					{this.props.userData.name}
				</a>
				<span className={this.props.notifications.length > 0 ? 'notifications active' : 'notifications'}></span>
			</div>
		</div>;
	}
}

export default Header;