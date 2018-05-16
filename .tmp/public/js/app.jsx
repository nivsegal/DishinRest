import React from 'react';
import ButtonsPane from './buttonsPane.jsx';
import RestaurantForm from './restaurantForm.jsx';
import RestaurantView from './restaurantView.jsx';
import { observable } from "mobx";
import { observer } from "mobx-react";

@observer class App extends React.Component {

	constructor(props) {
		super(props);
	}

	_handleRestaurantClick = () => {
		this.clicked = true;
	}

	_handleSubmitRestClick = (restaurant) => {
		this.clicked = false;
		this.submitRestClicked = true;
		this.restName = restaurant.restName;
	}

	@observable clicked = false;
	@observable submitRestClicked = false;
	@observable restName = '';
	@observable userData = null;

	render() {
		let view, buttonsPane = null;
		if (this.clicked === true) {
			view = <RestaurantForm submitCallback={this._handleSubmitRestClick} />;
		} else if (this.submitRestClicked === true) {
			view = <RestaurantView restName={this.restName} />;
		} else {
			buttonsPane = <ButtonsPane clickCallBack={this._handleRestaurantClick} />
		}
		return <div>
			<RestaurantView user={user} restaurant={restaurant} />
		</div>;
	}
}

export default App;