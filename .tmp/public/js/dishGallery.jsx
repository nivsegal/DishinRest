import React from 'react';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";

@observer class DishLayout extends React.Component {
	constructor(props) {
		super(props);
	}

	@observable dishes = [];

	_fetchDishes = () => {

	}

	_handleClick = e => {

	}

	render() {
		return <section className="dishesGallery basicFlexLayout">
			{
				this.props.dishes.map((dish, key) => {
					const dishimgUrl = `/uploads/${user.uid}/${dish.id}.png`;
					return <div key={key} className="dishesGalleryItemWrap roundCorners">
						<a href="#shepPie" id="#">
							<div className="dishPrew" style={{'backgroundImage': dishimgUrl}}>
							</div>
							<div className="dishTitleWrap">
								<p className="dishTitle">{dish.title}</p>
							</div>
						</a>
					</div>
				})
			}
		</section>
	}
}

export default DishLayout;

