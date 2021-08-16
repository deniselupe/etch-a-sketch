const gridParent = document.querySelector('.grid-parent');
const drawingColorSelector = document.getElementById('drawing-color');
const backgroundFillSelector = document.getElementById('background-fill');
const resetGridButton = document.getElementById('reset-button');
const clearGridButton = document.getElementById('clear-button');
const gridLinesButton = document.getElementById('grid-lines-button');
const undoButton = document.getElementById('undo-button');
const redoButton = document.getElementById('redo-button');
const darkenButton = document.getElementById('darken-button');
const lightenButton = document.getElementById('lighten-button');
const rgbButton = document.getElementById('rgb-button');
let historicalColoring = [];
let backgroundColor = 'rgb(255, 255, 255)';
let colorOptionSelected = 'drawingColorBool';
let colorChoice = 'rgb(0, 0, 0)';
let colorOptions = [
	{
		name: 'drawingColorBool',
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
	if (event.type === 'mousedown') historicalColoring = [];
	
	const gridChildren = Array.from(document.querySelectorAll('.grid-child'));
	const index = gridChildren.indexOf(event.target);
	const duplicateChildTest = (child) => child.index === index;
	const isChildDuplicate = historicalColoring.some(duplicateChildTest);
	const childObj = {};
	event.preventDefault();

	if (event.buttons === 1) {
		childObj.index = index;
		childObj.originalColor = event.target.style.backgroundColor;
		
		if (colorOptionSelected === 'drawingColorBool') {
			const hex = drawingColorSelector.value;
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
				let newValue = Math.ceil(oldValue * (100 + 20) / 100);
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
	
	gridParent.style.gridTemplateRows = `repeat(${squareAreaNumber}, 1fr)`;
	gridParent.style.gridTemplateColumns = `repeat(${squareAreaNumber}, 1fr)`;
	const gridChildren = Array.from(document.querySelectorAll('.grid-child'));
	
	gridChildren.forEach((item) => {
		item.addEventListener('mousedown', coloringRule);
		item.addEventListener('mouseenter', coloringRule);
	});
}

//This function enables/disables grid color options
const updateColorOptions = function() {
	const optionIndex = colorOptions.findIndex((option) => option.name === colorOptionSelected);
	
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
		
		colorOptionSelected = 'drawingColorBool';
		updateColorOptions();
	}
}

//Drawing Color Input Listener
drawingColorSelector.addEventListener('change', (event) => {
	colorOptionSelected = 'drawingColorBool';
	updateColorOptions();
});

//Background Fill Color Input Listener
backgroundFillSelector.addEventListener('change', (event) => {
	const gridChildren = Array.from(document.querySelectorAll('.grid-child'));
	newBackgroundColor = hexToRGB(backgroundFillSelector.value);
	
	gridChildren.forEach((child) => {
		if (child.style.backgroundColor === backgroundColor) {
			child.style.backgroundColor = newBackgroundColor;
		}
	});
	
	backgroundColor = newBackgroundColor;
});

//Reset Grid Button Listener
resetGridButton.addEventListener('click', () => {
	const gridNum = prompt('How many squares per side for the next grid?', '(Number must be less than or equal to 100)');
	
	if (gridNum === null) {
		return;
	} else if (gridNum > 0 && gridNum <= 100) {
		const gridChildren = Array.from(document.querySelectorAll('.grid-child'));
		gridChildren.forEach((child) => gridParent.removeChild(child));
		historicalColoring = [];
		drawingColorSelector.value = '#000000';
		backgroundFillSelector.value = '#FFFFFF';
		backgroundColor = 'rgb(255, 255, 255)';
		colorOptionSelected = 'drawingColorBool';
		updateColorOptions();
		createGridChildren(gridNum);
	} else {
		alert('Response must be a number less than or equal to 100. Please try again.');
		return;
	}
});

//Clear Grid Button Listener;
clearGridButton.addEventListener('click', () => {
	const gridChildren = Array.from(document.querySelectorAll('.grid-child'));
	gridChildren.forEach((child) => child.style.backgroundColor = backgroundColor);
});

//Grid Lines Button Listener
gridLinesButton.addEventListener('click', () => {
	if (!gridParent.style.gap) {
		gridParent.style.gap = '0px';
		gridLinesButton.textContent = 'Grid Lines: Off';
	} else {
		gridParent.style.gap = '';
		gridLinesButton.textContent = 'Grid Lines: On';
	}
});

//Undo Button Listener
undoButton.addEventListener('click', () => {
	const gridChildren = Array.from(document.querySelectorAll('.grid-child'));
	
	historicalColoring.forEach((child) => {
		gridChildren[child.index].style.backgroundColor = child.originalColor;
	});
});

//Redo Button Listener
redoButton.addEventListener('click', () => {
	const gridChildren = Array.from(document.querySelectorAll('.grid-child'));
	
	historicalColoring.forEach((child) => {
		gridChildren[child.index].style.backgroundColor = child.newColor;
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
