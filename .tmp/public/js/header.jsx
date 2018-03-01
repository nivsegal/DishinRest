import React from 'react';

class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return <div id="header">
			<span className="headerText">{this.props.headerText}</span>
			<div id="userAreaContainer">
				<a href="#">
					<img src={'//graph.facebook.com/' + this.props.userData.uid + '/picture'} />
					{this.props.userData.name}
				</a>
				<span className={this.props.notifications.length > 0 ? 'notifications active' : 'notifications'}></span>
			</div>
		</div>;
	}
}

export default Header;