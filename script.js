const gridParent = document.querySelector('.grid-parent');
const colorSelector = document.getElementById('color-selector');
const clearGridButton = document.getElementById('reset-button');
const darkenButton = document.getElementById('darken-button');
const lightenButton = document.getElementById('lighten-button');
const rgbButton = document.getElementById('rgb-button');
let normalColoringBool = true;
let darkenBool = false;
let lightenBool = false;
let rgbBool = false;
let colorChoice = 'rgb(0, 0, 0)';

function createGridChildren(squareAreaNumber) {
	for (let i = 0; i < squareAreaNumber ** 2; i++) {
		const gridChild = document.createElement('div');
		gridChild.classList.add('grid-child');
		gridChild.style.backgroundColor = 'rgb(255, 255, 255)';
		gridParent.appendChild(gridChild);
	}
	
	gridParent.style.gridTemplate = `repeat(${squareAreaNumber}, 1fr) / repeat(${squareAreaNumber}, 1fr)`;
	const gridChildren = Array.from(document.querySelectorAll('.grid-child'));
	
	function coloringRule(event) {
		event.preventDefault();
		if (normalColoringBool === true && event.buttons === 1) {
			const hex = colorSelector.value;
			colorChoice = hexToRGB(hex);
			event.target.style.backgroundColor = colorChoice;
		} else if (darkenBool === true && event.buttons === 1) {
			let currentRgbValues = event.target.style.backgroundColor;
			currentRgbValues = currentRgbValues.replace(/[^0-9]+/g, ' ').split(' ').splice(1, 3);
			const newRgbValues = [];

			for (i of currentRgbValues) {
				newRgbValues.push(Math.floor(i * (4/5)));
			}

			colorChoice = `rgb(${newRgbValues[0]}, ${newRgbValues[1]}, ${newRgbValues[2]})`;
			event.target.style.backgroundColor = colorChoice;
		} else if (lightenBool === true && event.buttons === 1) {
			let currentRgbValues = event.target.style.backgroundColor;
			currentRgbValues = currentRgbValues.replace(/[^0-9]+/g, ' ').split(' ').splice(1, 3);
			const newRgbValues = [];
			
			for (i of currentRgbValues) {
				let newValue = Math.floor(i * (100 + 20) / 100);
				if (newValue === 0) newValue = 50;
				
				if (newValue < 255) {
					newRgbValues.push(newValue);
				} else {
					newRgbValues.push(255);
				}
			}

			colorChoice = `rgb(${newRgbValues[0]}, ${newRgbValues[1]}, ${newRgbValues[2]})`;
			event.target.style.backgroundColor = colorChoice;
		}
	}
	
	gridChildren.forEach((item) => {
		item.addEventListener('mousedown', coloringRule);
		item.addEventListener('mouseenter', coloringRule);
	});
}

//Hex to RGB Formula
function hexToRGB(hex) {
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

//Color Input Button
colorSelector.addEventListener('change', (event) => {
	normalColoringBool = true;
	darkenBool = false;
	lightenBool = false;
	rgbBool = false;
	darkenButton.classList.remove('active-button');
	lightenButton.classList.remove('active-button');
	rgbButton.classList.remove('active-button');
	colorChoice = hexToRGB(event.target.value);
});

//Reset Grid Button Listener
clearGridButton.addEventListener('click', () => {
	const gridNum = prompt('How many squares per side for the next grid?', '(Number must be less than or equal to 100)');
	
	if (gridNum === null) {
		return;
	} else if (gridNum > 0 && gridNum <= 100) {
		const gridChildren = Array.from(document.querySelectorAll('.grid-child'));
		for (i of gridChildren) {
			gridParent.removeChild(i);
		}
		
		normalColoringBool = true;
		darkenBool = false;
		lightenBool = false;
		rgbBool = false;
		darkenButton.classList.remove('active-button');
		lightenButton.classList.remove('active-button');
		rgbButton.classList.remove('active-button');
		colorSelector.value = '#000000';
		createGridChildren(gridNum);
	} else {
		alert('Response must be a number less than or equal to 100. Please try again.');
		return;
	}
});

//Darken Button Listener
darkenButton.addEventListener( 'click', () => {
	if (darkenBool === false) {
		normalColoringBool = false;
		darkenBool = true;
		lightenBool = false;
		rgbBool = false;
		darkenButton.classList.add('active-button');
		lightenButton.classList.remove('active-button');
		rgbButton.classList.remove('active-button');
	} else if (darkenBool === true) {
		darkenBool = false;
		normalColoringBool = true;
		darkenButton.classList.remove('active-button')
	}
});

//Lighten Button Listener
lightenButton.addEventListener( 'click', () => {
	if (lightenBool === false) {
		normalColoringBool = false;
		darkenBool = false;
		lightenBool = true;
		rgbBool = false;
		darkenButton.classList.remove('active-button');
		lightenButton.classList.add('active-button');
		rgbButton.classList.remove('active-button');
	} else if (lightenBool === true) {
		lightenBool = false;
		normalColoringBool = true;
		lightenButton.classList.remove('active-button')
	}
});

createGridChildren(16);
