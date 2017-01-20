(function (window, document, undefined) {
	'use strict';


	let utils = {};

	/**
	 * 
	 * Listen when everything is loaded
	 * 
	 * @param  {Function} callback Called after load
	 * 
	 */
	utils.ready = function(callback) {
		window.addEventListener('load', callback);
	};

	/**
	 * 
	 * querySelector wrapper
	 * 
	 * @param  {string} selector Selector name
	 * 
	 * @return {object}          DOM element
	 * 
	 */
	utils.qs = function(selector) {
		return document.querySelector(selector);
	};

	/**
	 * 
	 * querySelectorAll wrapper
	 * 
	 * @param  {string} selector Selector name
	 * 
	 * @return {object}          DOM elements
	 * 
	 */
	utils.qsa = function(selector) {
		return document.querySelectorAll(selector);
	};

	/**
	 * 
	 * Avoid calling function too often
	 * 
	 * @param  {Function} fn    Function to call
	 * 
	 * @param  {int}      delay Delay after fn is called
	 * 
	 */
	utils.debounce = function(fn, delay) {
		let timeout = null;

		return function() {
			let _this = this;
			let args = arguments;

			clearTimeout(timeout);

			timeout = setTimeout(function() {
				fn.apply(_this, args);
			}, delay);
		};
	};



	function SimpleGallery(options) {

		this.options = options || {};
		this.containerWidth = 0;
		this.isFullWidth = false;
		this.barWidth = 17;

		this.defaults = {
			container: false,
			itemsPerRow: 4,
			space: 0,
			itemWidth: 320
		};

		this.init();
	};

	let proto = SimpleGallery.prototype;

	/**
	 * 
	 * Initialize all the methods
	 * 
	 */
	proto.init = function() {
		let self = this;

		utils.ready(function() {

			self.setDefaultsKeys();

			self.checkOptions(function() {

				self.calculateRows();
				self.setStyles();
				self.calculatePositions();

				window.addEventListener('resize', utils.debounce(self.onResize.bind(self), 50));
			});
		});
	};

	/**
	 * 
	 * Set default keys if not beeing set
	 * 
	 */
	proto.setDefaultsKeys = function() {
		for (let key in this.defaults) {
			if (!this.options.hasOwnProperty(key))
				this.options[key] = this.defaults[key];
		};
	};

	/**
	 * 
	 * Check if option container has been set
	 * 
	 * @param  {Function} callback Called when container and items was found
	 * 
	 */
	proto.checkOptions = function(callback) {
		if (((typeof this.options.container === 'string') && (this.options.container.length > 0))) {
			this.element = utils.qs(this.options.container);
			this.items = utils.qsa('.gallery-item');

			if (this.element && this.items) {
				callback();
			};
		};
	};

	/**
	 * 
	 * Set styles for the container and items
	 * 
	 */
	proto.setStyles = function() {

		let isItemWidthChanged = false;
		let rowWidth = 0;
		let highestColumn = 0;

		if (this.issetContainerWidth()) {
			this.containerWidth = this.element.offsetWidth;
		} else {

			this.containerWidth = document.body.clientWidth;

			this.isFullWidth = true;

		};

		rowWidth = this.options.itemWidth * this.cols;

		if (rowWidth > this.containerWidth) {
			this.setItemWidth(this.containerWidth - this.options.space);
			
			isItemWidthChanged = true;
		};

		this.setItemsStyle(this.options.itemWidth);

		highestColumn = this.getHighestColumn();

		if (this.isFullWidth && isItemWidthChanged) {

			if (highestColumn > document.body.clientHeight) {

				this.containerWidth -= this.barWidth + this.options.space;
				
				this.setItemWidth(this.containerWidth);

				this.setItemsStyle(this.options.itemWidth);
			};

		};

		this.element.style.position = 'relative';
		this.element.style.height = `${highestColumn}px`;
	};

	/**
	 * 
	 * Set new width for the option itemWidth  
	 * 
	 * @param {int} maxWidth Actual window width
	 * 
	 */
	proto.setItemWidth = function(maxWidth) {
		
		let itemW = 0;
		let cols = this.cols;
		let space = this.options.space;

		itemW = maxWidth / cols;
		itemW += space;

		this.options.itemWidth = itemW;
	};

	/**
	 * 
	 * Create new two dimensional array and fills it with Items
	 * 
	 */
	proto.calculateRows = function() {
		this.rows = Math.ceil(this.items.length / this.options.itemsPerRow);
		this.cols = this.options.itemsPerRow;

		this.itemsArray = [];

		for (let i = 0; i < this.rows; ++i) {
			this.itemsArray.push([]);
		};

		for (let i = 0; i < this.rows; ++i) {
			for (let j = 0; j < this.cols; ++j) {
				this.itemsArray[i].push(0);
			};
		};

		this.items.forEach ((element, index) => {

			let row = Math.floor(index / this.cols);
			let col = index % this.cols;

			this.itemsArray[row][col] = element;
		});
	};

	/**
	 * 
	 * Calculate positions for each item in two dimensional array
	 * 
	 */
	proto.calculatePositions = function() {
		
		let offsetLeft = 0;
		let offsetTop = 0;
		let space = this.options.space;

		for (let i = 0; i < this.rows; ++i) {

			offsetLeft = 0;

			for (let j = 0; j < this.cols; ++j) {

				if (this.itemsArray[i][j].style === undefined) {
					break;
				};

				if (j === 0) {
					offsetLeft = 0;
				} else {
				 	offsetLeft += this.options.itemWidth - space;
				};

				this.itemsArray[i][j].style.left = `${offsetLeft}px`;

				if (i === 0) {

					this.itemsArray[i][j].style.padding = `${space}px ${space}px ${space / 2}px ${space}px`;
				} else {
					this.itemsArray[i][j].style.padding = `${space / 2}px ${space}px ${space / 2}px ${space}px`;
				};

				if (i > 0) {

					offsetTop = 0;

					for (let k = 0; k < i; ++k) {
						offsetTop += this.itemsArray[k][j].offsetHeight;
					};
					
					this.itemsArray[i][j].style.top = `${offsetTop}px`;
				};
			};
		};
	};

	/**
	 * 
	 * Return highest column of itemsArray
	 * 
	 * @return {int} Number in pixels of highest column
	 * 
	 */
	proto.getHighestColumn = function() {
		let columns = [];
		let columnsHeight = [];
		let highest = 0;

		for (let i = 0; i < this.cols; ++i) {
			columns = this.itemsArray.map(item => item[i]);

			columnsHeight.push(columns.reduce((total, item) => {
				if (item !== 0) {
					return total + item.getBoundingClientRect().height;
				} else {
					return total + 0;
				}
			}, 0));
		};

		highest = Math.max.apply(Math, columnsHeight);
		
		return highest;
	};

	/**
	 * 
	 * Set styles for each item
	 * 
	 * @param {int} width Actual width of the item
	 * 
	 */
	proto.setItemsStyle = function(width) {
		this.items.forEach ((element, index) => {
			element.style.display = 'block';
			element.style.boxSizing = 'border-box';
			element.style.width = `${width}px`;
			element.style.position = 'absolute';
			element.children[0].style.display = 'block';
			element.children[0].style.width = '100%';
		});
	};

	/**
	 * 
	 * Check if container has CSS style width defined
	 * 
	 * @return {boolean} 
	 * 
	 */
	proto.issetContainerWidth = function() {
		return this.element.style.width && this.element.style.width !== null ? true : false;
	};

	/**
	 * 
	 * Get gallery container width or document width;
	 * 
	 * @return {int} Current document width
	 * 
	 */
	proto.getCurrentWidth = function() {
		return this.isFullWidth ? document.body.clientWidth : this.element.offsetWidth;
	};

	/**
	 * 
	 * Reset item width and set new positions
	 * 
	 */
	proto.onResize = function() {
		this.setItemWidth(this.getCurrentWidth());
		this.setStyles();
		this.calculatePositions();
	};


	window.Simplery = SimpleGallery;

}(window, document, undefined));