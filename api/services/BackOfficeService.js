
const xlsx = require('node-xlsx');
const moment = require('moment-timezone');
let os = require('os');

os.tmpDir = os.tmpdir;
/**
 * The Excel file sheets are meant to be ordered
 * in this order: 0 : restaurant, 1: menus, 2: categories, 3: dishes
 */

module.exports = {

	process: async () => {
		try {
			const workSheetsFromFile = await xlsx.parse(`${sails.config.uploadFolder}/restaurant.xlsx`);
			const restaurant = await BackOfficeService.saveRestaurant(workSheetsFromFile);
			const menus = await BackOfficeService.saveMenus(workSheetsFromFile, restaurant);
			const categories = await BackOfficeService.saveCategories(workSheetsFromFile);
			const dishes = await BackOfficeService.saveDishes(workSheetsFromFile);
		} catch (e) {
			console.log(e)
		}

	},

	saveRestaurant: async data => {
		const mapper = ['restName', 'address', 'description', 'tags'];
		let restObj = {};
		let hours = [];
		let restaurant = null;
		const restaurantSheet = data.find(elem => elem.name.toLowerCase() === 'restaurant');
		restaurantSheet.data.splice(0, 1); // skip titles
		restaurantSheet.data[0].map((elem, ind) => {
			restObj[mapper[ind]] = elem;
		});
		//Get Working hours: skip first two indices as they are titles
		restaurantSheet.data.filter((elem, ind) => { return ind > 2; }).map((elem, ind) => {
			const timeObj = BackOfficeService.getTimeArray(elem);
			hours.push({ start: moment.utc(timeObj['start']), end: moment.utc(timeObj['end']) })
		});

		restObj.hours = hours;
		try {
			restaurant = await Restaurant.create(restObj);
		} catch (e) {
			console.error('could not create restaurant :(', e);
		}

		return restaurant;
	},

	getTimeArray: data => {
		let hourArr = new Array();
		let resArr = new Object();
		hourArr['start'] = ((data[1] * 24).toString().split('.'));
		hourArr['end'] = ((data[2] * 24).toString().split('.'));
		const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
		resArr['start'] = moment().tz(tz).hour(hourArr['start'][0]).minute((hourArr['start'][1] ? hourArr['start'][1] * 6 : 0));
		resArr['end'] = moment().tz(tz).hour(hourArr['end'][0]).minute((hourArr['end'][1] ? hourArr['end'][1] * 6 : 0));
		return resArr;
	},

	saveMenus: async (data, restaurant) => {
		const menusSheet = data.find(elem => elem.name.toLowerCase() === 'menus');
		let menu = null, menus = [];
		menusSheet.data.filter(elem => { return elem.length > 0 && elem[0].includes('title') === false; }).map((elem, ind) => {
			let menuObj = {};
			menuObj['title'] = elem[0];
			const timeObj = BackOfficeService.getTimeArray(['', elem[1], elem[2]]);
			menuObj.hours = { start: moment.utc(timeObj['start']), end: moment.utc(timeObj['end']) };
			menuObj.restaurant = restaurant.id;
			menus.push(menuObj);
		});

		try {
			menu = await Menu.create(menus);
		} catch (e) {
			console.error('could not create menu :(', e);
		}

		return menu;
	},

	saveCategories: async data => {
		const categorySheet = data.find(elem => elem.name.toLowerCase() === 'categories');
		let categories = [], category = null;
		categorySheet.data.filter(elem => { return elem.length > 0 && elem[0].includes('title') === false; }).map(async (elem, ind) => {
			let catObj = {};
			catObj['title'] = elem[0];
			try {
				const menu = await Menu.findOne({ title: elem[1] });
				catObj['menu'] = menu.id;
				category = await MenuCategory.create(catObj);
			} catch (e) {
				console.log(e);
			}
		});

		return category;
	},

	saveDishes: data => {
		const mapper = ['title', 'description', 'price', 'currency'];
		const DishesSheet = data.find(elem => elem.name.toLowerCase() === 'dishes');
		let dish = null;
		DishesSheet.data.filter(elem => { return elem[0].includes('title') === false; }).map(async (elem, ind) => {
			let dishObj = {};
			elem.map((inner, ind) => {
				dishObj[mapper[ind]] = inner;
			});
			try {
				const categories = await MenuCategory.find({ title: elem[elem.length - 1].split(',') });
				const tags = await Tag.find({ title: elem[elem.length - 2].split(',') });
				dishObj['categories'] = categories.filter(elem => { return elem != null }).map(elem => elem.id);
				dishObj['tags'] = tags.filter(elem => { return elem != null }).map(elem => elem.id);
				dishObj['price'] = parseFloat(dishObj['price']);
				dish = await MenuItem.create(dishObj);
			} catch (e) {
				console.log(e);
			}
		});

		return dish;
	}
};