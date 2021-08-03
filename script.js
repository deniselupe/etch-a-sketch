let gridParent = document.querySelector('.grid-parent');
let resetButton = document.querySelector('.reset-button')
let clearGridButton = document.querySelector('.reset-button');


function createGridChildren(squareAreaNumber) {
	for (let i = 0; i < squareAreaNumber ** 2; i++) {
		let gridChild = document.createElement('div');
		gridChild.classList.add('grid-child');
		gridParent.appendChild(gridChild);
	}
	
	gridParent.style.gridTemplate = `repeat(${squareAreaNumber}, 1fr) / repeat(${squareAreaNumber}, 1fr)`;
	let gridChild = Array.from(document.querySelectorAll('.grid-child'));

	gridChild.forEach((item) => {
		item.addEventListener('mouseover', function () {
			item.setAttribute('style', 'background-color: black;');
		});
	});
}

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

