import React from 'react';
import { observable, action, autorun } from "mobx";
import { observer } from "mobx-react";

@observer class DishPreview extends React.Component {
	constructor(props) {
		super(props);
	}

	_fetchDishes = () => {

	}

	_handleClick = e => {

	}

	render() {
		const { dish } = this.props;
		console.log(this.props);

		return <section className="dishDetails roundCorners">
			<div className="dishPhotos">
				<div className="mainPhotoWrap">
					<img className="mainPhoto" src="../images/pexel.jpeg" alt='Dish Title' />
				</div>
				<div className="topLeftCornerTag"></div>

				<div className="plateMiniatures basicFlexLayout">
					<div className="platePhoto" id="platePhoto2">
						<img className="platePhotoMini" alt="miniature" src="../images/kruvit.png" />
					</div>
					<div className="platePhoto" id="platePhoto2">
						<img className="platePhotoMini" alt="miniature" src="../images/kruvit.png" />
					</div>
					<div className="platePhoto" id="platePhoto2">
						<img className="platePhotoMini" alt="miniature" src="../images/kruvit.png" />
					</div>

				</div>
			</div>
			<article className="dishDescr">
				<h1 className="basicTitle">{dish.title}</h1>
				<p className="shortDescr basicText">{dish.description}</p>
				<div className="basicFlexLayout dishNutrition">
					<div className="dishNutritionItem">
						<p className="nutrient basicText">kCal</p>
						<p className="amount basicText">235</p>
					</div>
					<div className="dishNutritionItem">
						<p className="nutrient basicText">Sugars</p>
						<p className="amount basicText">22g</p>
					</div>
					<div className="dishNutritionItem">
						<p className="nutrient basicText">Protein</p>
						<p className="amount basicText">35g</p>
					</div>
					<div className="dishNutritionItem">
						<p className="nutrient basicText">Carbs</p>
						<p className="amount basicText">65g</p>
					</div>
					<div className="dishNutritionItem">
						<p className="nutrient basicText">Sugars</p>
						<p className="amount basicText">22g</p>
					</div>
					<div className="dishNutritionItem">
						<p className="nutrient basicText">Protein</p>
						<p className="amount basicText">35g</p>
					</div>
					<div className="dishNutritionItem">
						<p className="nutrient basicText">Carbs</p>
						<p className="amount basicText">65g</p>
					</div>
				</div>


				<div className="tags">
					<div className="dishTag" >
						<svg className="icon" xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14">
							<path fillRule="evenodd" d="M1.745 12.547c.468-1.16 1.534-2.982 2.657-4.672.153-.23.307-.458.461-.682l1.092 1.092a.413.413 0 0 0 .583-.584L5.344 6.507c.807-1.132 1.57-2.098 2.07-2.596a2.464 2.464 0 0 1 1.748-.723 2.465 2.465 0 0 1 2.473 2.473c0 .635-.241 1.266-.723 1.749L9.454 5.952a.412.412 0 1 0-.583.583l1.427 1.428c-.815.689-2.05 1.595-3.35 2.458-.475.315-.959.624-1.437.919l-.722-.723a.412.412 0 1 0-.583.583l.578.578c-.953.561-1.84 1.031-2.508 1.3l-.153.032a.41.41 0 0 1-.286-.124.408.408 0 0 1-.124-.286l.032-.153zm.38 1.387c.153 0 .31-.03.462-.091 1.267-.515 3.096-1.593 4.817-2.736 1.721-1.145 3.31-2.335 4.09-3.114a3.29 3.29 0 0 0 .965-2.332c0-.563-.146-1.217-.432-1.629.65a.412.412 0 0 0 0-.824h-1.479l1.337-1.338a.413.413 0 0 0-.583-.583l-1.337 1.338V1.146a.412.412 0 0 0-.824 0v1.65c-.413-.286-1.067-.432-1.629-.432a3.29 3.29 0 0 0-2.332.964c-.779.781-1.97 2.37-3.115 4.09C2.573 9.14 1.495 10.97.98 12.238c-.062.152-.091.31-.091.463.006.68.555 1.228 1.235 1.234z" />
						</svg>
						<a href="#vegetarian" className="basicText">Vegetarian</a>
					</div>

					<div className="dishTag" >
						<svg className="icon" xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14">
							<path fillRule="evenodd" d="M1.745 12.547c.468-1.16 1.534-2.982 2.657-4.672.153-.23.307-.458.461-.682l1.092 1.092a.413.413 0 0 0 .583-.584L5.344 6.507c.807-1.132 1.57-2.098 2.07-2.596a2.464 2.464 0 0 1 1.748-.723 2.465 2.465 0 0 1 2.473 2.473c0 .635-.241 1.266-.723 1.749L9.454 5.952a.412.412 0 1 0-.583.583l1.427 1.428c-.815.689-2.05 1.595-3.35 2.458-.475.315-.959.624-1.437.919l-.722-.723a.412.412 0 1 0-.583.583l.578.578c-.953.561-1.84 1.031-2.508 1.3l-.153.032a.41.41 0 0 1-.286-.124.408.408 0 0 1-.124-.286l.032-.153zm.38 1.387c.153 0 .31-.03.462-.091 1.267-.515 3.096-1.593 4.817-2.736 1.721-1.145 3.31-2.335 4.09-3.114a3.29 3.29 0 0 0 .965-2.332c0-.563-.146-1.217-.432-1.629h1.65a.412.412 0 0 0 0-.824h-1.479l1.337-1.338a.413.413 0 0 0-.583-.583l-1.337 1.338V1.146a.412.412 0 0 0-.824 0v1.65c-.413-.286-1.067-.432-1.629-.432a3.29 3.29 0 0 0-2.332.964c-.779.781-1.97 2.37-3.115 4.09C2.573 9.14 1.495 10.97.98 12.238c-.062.152-.091.31-.091.463.006.68.555 1.228 1.235 1.234z" />
						</svg>
						<a href="#glutenfree" className="basicText">Gluten Free</a>
					</div>
				</div>

			</article>
			<button className="submitButton basicText" onClick={this.props.showAddDishForm}>Add</button>
		</section>
	}
}

export default DishPreview;

