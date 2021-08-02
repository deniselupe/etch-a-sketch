let gridContainer = document.querySelector('.grid-container');
let squareAreaNumber = 16;

for (let i = 0; i < squareAreaNumber ** 2; i++) {
	let gridItem = document.createElement('div');
	gridItem.classList.add('grid-item');
	gridContainer.appendChild(gridItem);
}

let gridItem = Array.from(document.querySelectorAll('.grid-item'));

gridItem.forEach((item) => {
	item.addEventListener('mouseover', function () {
		item.setAttribute('style', 'background-color: black;');
	});
});
