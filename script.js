let gridParent = document.querySelector('.grid-parent');
let colorSelector = document.getElementById('color-selector');
let clearGridButton = document.getElementById('reset-button');
let darkenButton = document.getElementById('darken-button');
let lightenButton = document.getElementById('lighten-button');
let rgbButton = document.getElementById('rgb-button');
let darkenBool = false;
let lightenBool = false;
let rgbBool = false;
let colorChoice = 'rgb(0, 0, 0)';

function createGridChildren(squareAreaNumber) {
	for (let i = 0; i < squareAreaNumber ** 2; i++) {
		let gridChild = document.createElement('div');
		gridChild.classList.add('grid-child');
		gridParent.appendChild(gridChild);
	}
	
	gridParent.style.gridTemplate = `repeat(${squareAreaNumber}, 1fr) / repeat(${squareAreaNumber}, 1fr)`;
	let gridChild = Array.from(document.querySelectorAll('.grid-child'));
	
	function coloringRule(event) {
		event.preventDefault();
		if (event.buttons === 1) event.target.style.backgroundColor = colorChoice;
	}
	
	gridChild.forEach((item) => {
		item.addEventListener('mousedown', coloringRule);
		item.addEventListener('mousemove', coloringRule);
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
	colorChoice = hexToRGB(event.target.value);
});

//Reset Grid Button
clearGridButton.addEventListener('click', () => {
	let gridNum = prompt('How many squares per side for the next grid?', '(Number must be less than or equal to 100)');
	if (gridNum > 100) {
		alert("Too big of a number, enter a digit less than or equal to 100.");
		return;
	}

	let gridChildren = Array.from(document.querySelectorAll('.grid-child'));
	for (i of gridChildren) {
		gridParent.removeChild(i);
	}

	createGridChildren(gridNum);
});

createGridChildren(16);