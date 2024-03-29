let gridChildren;
let drawingInstance = [];
let historicalColoring = [];
let undoNumber = 0;
let backgroundColor = 'rgb(255, 255, 255)';
let colorChoice = 'rgb(0, 0, 0)';
const gridParent = document.querySelector('.grid-parent');
const drawingColor = document.getElementById('drawing-color');
const backgroundFill = document.getElementById('background-fill');
const resetGridButton = document.getElementById('reset-button');
const clearGridButton = document.getElementById('clear-button');
const eraserButton = document.getElementById('eraser-button');
const gridLinesButton = document.getElementById('grid-lines-button');
const undoButton = document.getElementById('undo-button');
const redoButton = document.getElementById('redo-button');
const colorPickButton = document.getElementById('color-pick-button');
const darkenButton = document.getElementById('darken-button');
const lightenButton = document.getElementById('lighten-button');
const rgbButton = document.getElementById('rgb-button');


// Each object in colorOptions represents a button that changes drawing behavior
const colorOptions = [
	{
		name: 'drawingColorBool',
		value: true,
		element: null,
		colorRule: function() {
			colorChoice = changeVal.hexToRgb(drawingColor.value);
			event.target.style.backgroundColor = colorChoice;
			return event.target.style.backgroundColor;
		}
	},
	{
		name: 'eraserBool',
		value: false,
		element: eraserButton,
		colorRule: function() {
			event.target.style.backgroundColor = backgroundColor;
			return event.target.style.backgroundColor;
		}
	},
	{
		name: 'colorPickerBool',
		value: false,
		element: colorPickButton,
		colorRule: function() {
			changeVal.rgbToHex(event.target.style.backgroundColor, drawingColor);
			updateColorOptions('drawingColorBool');
		}
	},
	{
		name: 'darkenBool',
		value: false,
		element: darkenButton,
		colorRule: function() {
			const newRgbValues = [];
			const currentRgbValues = changeVal.rgbToArray(event.target.style.backgroundColor);

			currentRgbValues.forEach((oldValue) => {
				newRgbValues.push(Math.floor(oldValue * (4/5)));
			});

			colorChoice = `rgb(${newRgbValues[0]}, ${newRgbValues[1]}, ${newRgbValues[2]})`;
			event.target.style.backgroundColor = colorChoice;
			return event.target.style.backgroundColor;
		}
	},
	{
		name: 'lightenBool',
		value: false,
		element: lightenButton,
		colorRule: function() {
			const newRgbValues = [];
			const currentRgbValues = changeVal.rgbToArray(event.target.style.backgroundColor);

			currentRgbValues.forEach((oldValue) => {
				if (oldValue < 5) oldValue = 50;
				const newValue = Math.ceil(oldValue * (100 + 45) / 100);

				if (newValue < 255) {
					newRgbValues.push(newValue);
				} else {
					newRgbValues.push(255);
				}
			});

			colorChoice = `rgb(${newRgbValues[0]}, ${newRgbValues[1]}, ${newRgbValues[2]})`;
			event.target.style.backgroundColor = colorChoice;
			return event.target.style.backgroundColor;
		}
	},
	{
		name: 'rgbBool',
		value: false,
		element: rgbButton,
		colorRule: function() {
			colorChoice = `hsl(${Math.ceil(Math.random() * 360)}, 100%, 50%)`;
			event.target.style.backgroundColor = colorChoice;
			return event.target.style.backgroundColor;
		}
	},
];

// Methods to update or convert values
const changeVal = {
	rgbToArray(rgbValues) {
		return rgbValues.replace(/[^0-9]+/g, ' ').split(' ').splice(1, 3);
	},
	rgbToHex(color, objectChanged) {
		const currentRgbValues = changeVal.rgbToArray(color);
		let hexValues = [];
		
		currentRgbValues.forEach((value) => {
			let hex = parseInt(value);
			hex = hex.toString(16);

			if (hex.length === 1) hex = '0' + hex;
			hexValues.push(hex);
		});

		hexValues = `#${hexValues.join('')}`;
		objectChanged.value = hexValues;
	},
	hexToRgb(hex) {
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
	},
	addUndo() {
		if (drawingInstance.length > 0) {
			historicalColoring.unshift(drawingInstance);
			drawingInstance = [];
		}
	},
	overrideUndo() {
		if (undoNumber > 0) {
			historicalColoring = historicalColoring.slice(undoNumber);
			undoNumber = 0;
		}
	}
};

// Object Constructor for drawingInstance objects
function undoEvent(index, originalColor, newColor) {
	this.index = index;
	this.originalColor = originalColor;
	this.newColor = newColor;
}

// This function is what creates the grid
const createGridChildren = function(squareAreaNumber) {
	for (let i = 0; i < squareAreaNumber ** 2; i++) {
		const gridChild = document.createElement('div');
		gridChild.classList.add('grid-child');
		gridChild.style.backgroundColor = 'rgb(255, 255, 255)';
		gridParent.appendChild(gridChild);
	}
	
	gridParent.style.gridTemplateRows = `repeat(${squareAreaNumber}, 1fr)`;
	gridParent.style.gridTemplateColumns = `repeat(${squareAreaNumber}, 1fr)`;
	gridChildren = Array.from(document.querySelectorAll('.grid-child'));
	
	gridChildren.forEach((item) => {
		item.addEventListener('mousedown', coloringRule);
		item.addEventListener('mouseenter', coloringRule);
	});
};

// The rules for how each colorOptions button will color grid squares
const coloringRule = function(event) {
	if (event.type === 'mousedown') {
		changeVal.addUndo();
		changeVal.overrideUndo();
	}

	event.preventDefault();
	const index = gridChildren.indexOf(event.target);
	const duplicateChildTest = (child) => child.index === index;
	const isChildDuplicate = drawingInstance.some(duplicateChildTest);
	const ruleIndex = colorOptions.findIndex((option) => option.value === true);

	if (event.buttons === 1) {
		if (colorOptions[ruleIndex].name === 'colorPickerBool') {
			colorOptions[ruleIndex].colorRule();
		} else {
			const gridSquareColor = event.target.style.backgroundColor;
			const childObj = new undoEvent(index, gridSquareColor, colorOptions[ruleIndex].colorRule());
			if (isChildDuplicate === false) drawingInstance.push(childObj);
		}
	}
};

// Background Fill Color Input Listener
backgroundFill.addEventListener('change', (event) => {
	newBackgroundColor = changeVal.hexToRgb(backgroundFill.value);
	changeVal.addUndo();
	changeVal.overrideUndo();
	
	gridChildren.forEach((child, index) => {
		if (child.style.backgroundColor === backgroundColor) {
			const childObj = new undoEvent(index, child.style.backgroundColor, newBackgroundColor);
			childObj.oldFill = function (){
        // When undoing, reverse backgroundColor's value back to that of the predecessor background color
				backgroundColor = childObj.originalColor;
				changeVal.rgbToHex(childObj.originalColor, backgroundFill);
			};
			childObj.newFill = function () {
        // When redoing, update backgroundColor's value back to that of the successor background color
				backgroundColor = childObj.newColor;
				changeVal.rgbToHex(childObj.newColor, backgroundFill);
			};
			child.style.backgroundColor = newBackgroundColor;
			drawingInstance.push(childObj);
		}
	});

	backgroundColor = newBackgroundColor;
});

// Reset Grid Button Listener
resetGridButton.addEventListener('click', () => {
	const gridNum = prompt('How many squares per side for the next grid?', '(Number must be less than or equal to 100)');
	
	if (gridNum === null) {
		return;
	} else if (gridNum > 0 && gridNum <= 100) {
		gridChildren.forEach((child) => gridParent.removeChild(child));
		historicalColoring = [];
		drawingInstance = [];
		undoNumber = 0;
		drawingColor.value = '#000000';
		backgroundFill.value = '#FFFFFF';
		backgroundColor = 'rgb(255, 255, 255)';
		updateColorOptions('drawingColorBool');
		createGridChildren(gridNum);
	} else {
		alert('Response must be a number less than or equal to 100. Please try again.');
		return;
	}
});

// Clear Grid Button Listener;
clearGridButton.addEventListener('click', () => {
	changeVal.addUndo();
	changeVal.overrideUndo();
	
	gridChildren.forEach((child, index) => {
		if (child.style.backgroundColor !== backgroundColor) {
			const childObj = new undoEvent(index, child.style.backgroundColor, backgroundColor);
			child.style.backgroundColor = backgroundColor;
			drawingInstance.push(childObj);
		}
	});
});

// Grid Lines Button Listener
gridLinesButton.addEventListener('click', () => {
	if (!gridParent.style.gap) {
		gridParent.style.gap = '0px';
		gridLinesButton.textContent = 'Grid Lines: Off';
	} else {
		gridParent.style.gap = '';
		gridLinesButton.textContent = 'Grid Lines: On';
	}
});

// Undo Button Listener
undoButton.addEventListener('click', () => {
	changeVal.addUndo();
	
	if (undoNumber < historicalColoring.length) {
		historicalColoring[undoNumber].forEach((child) => {
			gridChildren[child.index].style.backgroundColor = child.originalColor;
			
			if (child.oldFill) child.oldFill();
		});
		
		undoNumber = undoNumber + 1;
	}
});

// Redo Button Listener
redoButton.addEventListener('click', () => {
	if (undoNumber > 0) {
		undoNumber = undoNumber - 1;
		
		historicalColoring[undoNumber].forEach((child) => {
			gridChildren[child.index].style.backgroundColor = child.newColor;
			
			if (child.newFill) child.newFill();
		});
	}
});

// This function enables/disables grid color options
const updateColorOptions = function (optionSelected) {
	const optionIndex = colorOptions.findIndex((option) => option.name === optionSelected);
	
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

		updateColorOptions('drawingColorBool');
	}
};

// A Factory method that provides event listener functionality for each button listed in colorOptions
const eventButton = (button, eventType, selectedName) => {
	button.addEventListener(eventType, () => {
		updateColorOptions(selectedName);
	});
};

eventButton(drawingColor, 'change', 'drawingColorBool');
eventButton(eraserButton, 'click', 'eraserBool');
eventButton(colorPickButton, 'click', 'colorPickerBool');
eventButton(darkenButton, 'click', 'darkenBool');
eventButton(lightenButton, 'click', 'lightenBool');
eventButton(rgbButton, 'click', 'rgbBool');

createGridChildren(16);
