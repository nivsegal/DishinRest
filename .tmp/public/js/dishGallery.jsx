import React from 'react';

class DishLayout extends React.Component {
	constructor(props) {
		super(props);
	}

	_fetchDishes = () => {
		
	}

	_handleClick = e => {

	}

	render() {
		return <section className="dishesGallery basicFlexLayout">
			<div className="dishesGalleryItemWrap roundCorners">
				<a href="#shepPie" id="#">
					<div className="dishPrew">
					</div>
					<div className="dishTitleWrap">
						<p className="dishTitle">Shepard's Pie</p>
					</div>
				</a>
			</div>
		</section>
	}
}

export default DishLayout;

