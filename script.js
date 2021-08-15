const gridParent = document.querySelector('.grid-parent');
const colorSelector = document.getElementById('color-selector');
const clearGridButton = document.getElementById('reset-button');
const undoButton = document.getElementById('undo-button');
const darkenButton = document.getElementById('darken-button');
const lightenButton = document.getElementById('lighten-button');
const rgbButton = document.getElementById('rgb-button');
let historicalColoring = [];
let colorOptionSelected = 'normalColoringBool';
let colorChoice = 'rgb(0, 0, 0)';
let colorOptions = [
	{
		name: 'normalColoringBool',
		value: true,
		element: null
	},
	{
		name: 'darkenBool',
		value: false,
		element: darkenButton
	},
	{
		name: 'lightenBool',
		value: false,
		element: lightenButton
	},
	{
		name: 'rgbBool',
		value: false,
		element: rgbButton
	},
];

//Hex to RGB Formula
const hexToRGB = function(hex) {
	let r = 0;
	let g = 0;
	let b = 0;

	// 3 digits
	if (hex.length == 4) {
		r = "0x" + hex[1] + hex[1];
		g = "0x" + hex[2] + hex[2];
		b = "0x" + hex[3] + hex[3];
	// 6 digits
	} else if (hex.length == 7) {
		r = "0x" + hex[1] + hex[2];
		g = "0x" + hex[3] + hex[4];
		b = "0x" + hex[5] + hex[6];
	}

	return `rgb(${+r}, ${+g}, ${+b})`;
}

//The rules for how each colorOptions button will color the grid
const coloringRule = function(event) {
	const gridChildren = Array.from(document.querySelectorAll('.grid-child'));
	const index = gridChildren.indexOf(event.target);
	const duplicateChildTest = (child) => child.index === index;
	const isChildDuplicate = historicalColoring.some(duplicateChildTest);
	const childObj = {};
	event.preventDefault();
	
	if (event.type === 'mousedown') historicalColoring = [];
	
	if (event.buttons === 1) {
		childObj.index = index;
		childObj.originalColor = event.target.style.backgroundColor;

		if (colorOptionSelected === 'normalColoringBool') {
			const hex = colorSelector.value;
			colorChoice = hexToRGB(hex);
			event.target.style.backgroundColor = colorChoice;
		} else if (colorOptionSelected === 'darkenBool') {
			const newRgbValues = [];
			let currentRgbValues = event.target.style.backgroundColor;
			currentRgbValues = currentRgbValues.replace(/[^0-9]+/g, ' ').split(' ').splice(1, 3);

			currentRgbValues.forEach((oldValue) => {
				newRgbValues.push(Math.floor(oldValue * (4/5)));
			});

			colorChoice = `rgb(${newRgbValues[0]}, ${newRgbValues[1]}, ${newRgbValues[2]})`;
			event.target.style.backgroundColor = colorChoice;
		} else if (colorOptionSelected === 'lightenBool') {
			const newRgbValues = [];
			let currentRgbValues = event.target.style.backgroundColor;
			currentRgbValues = currentRgbValues.replace(/[^0-9]+/g, ' ').split(' ').splice(1, 3);

			currentRgbValues.forEach((oldValue) => {
				let newValue = Math.floor(oldValue * (100 + 20) / 100);
				if (newValue === 0) newValue = 50;

				if (newValue < 255) {
					newRgbValues.push(newValue);
				} else {
					newRgbValues.push(255);
				}
			});

			colorChoice = `rgb(${newRgbValues[0]}, ${newRgbValues[1]}, ${newRgbValues[2]})`;
			event.target.style.backgroundColor = colorChoice;
		} else if (colorOptionSelected === 'rgbBool') {
			colorChoice = `hsl(${Math.ceil(Math.random() * 360)}, 100%, 50%)`;
			event.target.style.backgroundColor = colorChoice;
		}
		
		childObj.newColor = event.target.style.backgroundColor;
		if (isChildDuplicate === false) historicalColoring.push(childObj);
	}
}

//This function is what creates the grid
const createGridChildren = function(squareAreaNumber) {
	for (let i = 0; i < squareAreaNumber ** 2; i++) {
		const gridChild = document.createElement('div');
		gridChild.classList.add('grid-child');
		gridChild.style.backgroundColor = 'rgb(255, 255, 255)';
		gridParent.appendChild(gridChild);
	}
	
	gridParent.style.gridTemplate = `repeat(${squareAreaNumber}, 1fr) / repeat(${squareAreaNumber}, 1fr)`;
	const gridChildren = Array.from(document.querySelectorAll('.grid-child'));
	
	gridChildren.forEach((item) => {
		item.addEventListener('mousedown', coloringRule);
		item.addEventListener('mouseenter', coloringRule);
	});
}

//This function enables/disables grid color options
const updateColorOptions = function() {
	let optionIndex = colorOptions.findIndex((option) => option.name === colorOptionSelected);
	
	if (colorOptions[optionIndex].value === false) {
		colorOptions.forEach((option) => {
			option.value = false;
			
			if (option.element) {
				option.element.classList.remove('active-button');
			}
		});
		
		if (colorOptions[optionIndex].element) {
			colorOptions[optionIndex].element.classList.add('active-button');
		}
		
		colorOptions[optionIndex].value = true;
	} else if (colorOptions[optionIndex].value === true) {
		colorOptions[optionIndex].value = false;
		 
		if (colorOptions[optionIndex].element) {
			colorOptions[optionIndex].element.classList.remove('active-button');
		}
		
		colorOptionSelected = 'normalColoringBool';
		updateColorOptions();
	}
}

//Color Input Button
colorSelector.addEventListener('change', (event) => {
	colorOptionSelected = 'normalColoringBool';
	updateColorOptions();
	colorChoice = hexToRGB(event.target.value);
});

//Reset Grid Button Listener
clearGridButton.addEventListener('click', () => {
	const gridNum = prompt('How many squares per side for the next grid?', '(Number must be less than or equal to 100)');
	
	if (gridNum === null) {
		return;
	} else if (gridNum > 0 && gridNum <= 100) {
		const gridChildren = Array.from(document.querySelectorAll('.grid-child'));
		gridChildren.forEach((child) => gridParent.removeChild(child));
		historicalColoring = [];
		colorOptionSelected = 'normalColoringBool';
		updateColorOptions();
		colorSelector.value = '#000000';
		createGridChildren(gridNum);
	} else {
		alert('Response must be a number less than or equal to 100. Please try again.');
		return;
	}
});

//Undo Button Listener
undoButton.addEventListener('click', () => {
	let gridChildren = Array.from(document.querySelectorAll('.grid-child'));
	
	historicalColoring.forEach((child) => {
		gridChildren[child.index].style.backgroundColor = child.originalColor;
	});
});

//Darken Button Listener
darkenButton.addEventListener( 'click', () => {
	colorOptionSelected = 'darkenBool';
	updateColorOptions();
});

//Lighten Button Listener
lightenButton.addEventListener( 'click', () => {
	colorOptionSelected = 'lightenBool';
	updateColorOptions();
});

//Rainbow Button Listener
rgbButton.addEventListener('click', () => {
	colorOptionSelected = 'rgbBool';
	updateColorOptions();
});

createGridChildren(16);
