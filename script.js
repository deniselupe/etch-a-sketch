let gridContainer = document.querySelector('.grid-container');
let squareAreaNumber = 16;

for (let i = 0; i < squareAreaNumber ** 2; i++) {
	let gridItem = document.createElement('div');
	gridItem.classList.add('grid-item');
	gridContainer.appendChild(gridItem);
}
