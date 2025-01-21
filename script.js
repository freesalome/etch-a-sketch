let shading = document.createElement('button');
shading.textContent = 'Shading Mode';

let brush = document.createElement('button');
brush.textContent = 'Color Mode';

let erase = document.createElement('button');
erase.textContent = 'Erase';

let clearGrid = document.createElement('button');
clearGrid.textContent = 'Clear';

let rainbow = document.createElement('button');
rainbow.textContent = 'Rainbow Mode';

const buttons = document.querySelector('#buttons');

buttons.appendChild(brush);
buttons.appendChild(shading);
buttons.appendChild(rainbow);
buttons.appendChild(erase);
buttons.appendChild(clearGrid);

const gridSizeInput = document.querySelector('#grid-size');
gridSizeInput.value = gridSizeInput.min;
const gridSizeValue = document.querySelector('label[for="grid-size"]');
const container = document.querySelector('#container');

clearGrid.after(gridSizeInput);
clearGrid.after(gridSizeValue);

for (let i = 0; i < 100; i++) {
    const square = document.createElement('div');
    square.classList.add('squares');
    square.style.flex = `0 0 10%`;
    square.style.height = '10%';
    square.style.border = `1px solid black`;
    square.style.backgroundColor = 'white';
    container.appendChild(square);
}

let lastActiveButton = brush;

document.addEventListener("DOMContentLoaded", () => {
    brush.click();
    brush.classList.add('active-button');
});

buttons.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
        Array.from(document.querySelectorAll('.active-button')).forEach((e) => e.classList.remove('active-button'));
        event.target.classList.add('active-button');
        lastActiveButton = event.target;
    }
});

gridSizeInput.addEventListener('mousedown', (event) => {
    event.stopPropagation();
});

gridSizeInput.addEventListener('input', (event) => {
    const gridSize = event.target.value;
    gridSizeValue.textContent = `Grid Size: ${gridSize} x ${gridSize}`;
    const squareSize = `${100 / gridSize}%`;

    function updateGrid() {
        container.innerText = "";
        for (let i = 0; i < (gridSize ** 2); i++) {
            const square = document.createElement('div');
            square.classList.add('squares');
            square.style.flex = `0 0 ${squareSize}`;
            square.style.height = squareSize;
            square.style.border = `1px solid black`;
            square.style.backgroundColor = 'white';
            container.appendChild(square);
        }
    }

    updateGrid();

    if (lastActiveButton) {
        lastActiveButton.classList.add('active-button');
    }
});

const colorPicker = document.querySelector('#color-picker');

brush.addEventListener('click', function myCallBack() {
    const brushColor = colorPicker.value;

    container.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        changeColor(event);
        event.preventDefault();
    });

    container.addEventListener('mouseenter', (event) => {
        if (event.buttons === 1) {
            changeColor(event);
        }
    }, {capture: true});

    function changeColor(event) {
        const div = event.target;
        if (div && div.classList.contains('squares')) {
            const brushColor = colorPicker.value;
            div.style.backgroundColor = brushColor;
        }
    }
});

shading.addEventListener('click', () => {
    container.addEventListener('mousedown', (event) => {
        shadeColor(event);
        event.preventDefault();
    });

    container.addEventListener('mouseenter', (event) => {
        if (event.buttons === 1) {
            shadeColor(event);
        }
    }, {capture: true}); 

    function shadeColor(event) {
        const div = event.target;
    
        if (div && div.classList.contains('squares')) {
            if (!div.hasAttribute('data-shading')) {
                div.setAttribute('data-shading', '0');
            }
    
            let currentShading = parseInt(div.getAttribute('data-shading'), 10);
    
            if (currentShading < 100) {
                currentShading += 10;
                if (currentShading > 100) {
                    currentShading = 100;
                }
    
                div.setAttribute('data-shading', currentShading);
    
                const shadeValue = 255 - (currentShading * 2.55);
                div.style.backgroundColor = `rgb(${shadeValue}, ${shadeValue}, ${shadeValue})`;
            }

            if (currentShading == 100) {
                div.style.backgroundColor = 'black';
            }
        }
    }
});

rainbow.addEventListener('click', () => {
    container.addEventListener('mousedown', (event) => {
        randomizeColor(event);
        event.preventDefault(event);
    });

    container.addEventListener('mouseenter', (event) => {
        if (event.buttons === 1) {
            randomizeColor(event);
        }
    }, {capture: true});

    function randomizeColor(event) {
        const div = event.target;

        if (div && div.classList.contains('squares')) {
            let numR = Math.random() * 256;
            let numG = Math.random() * 256;
            let numB = Math.random() * 256;

            div.style.backgroundColor = `rgb(${numR}, ${numG}, ${numB})`;
        };
    }
});

erase.addEventListener('click', () => {
    let isMouseDown = false;

    container.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        eraseColor(event);
        event.preventDefault();
    });

    container.addEventListener('mouseenter', (event) => {
        if (event.buttons === 1) {
            isMouseDown = true;
            eraseColor(event);
        }
    }, {capture: true});

    function eraseColor(event) {
        const div = event.target;
        if (div && div.classList.contains('squares')) {
            div.style.backgroundColor = 'white';
        }
    }
});

clearGrid.addEventListener('click', () => {
    colorPicker.disabled = true;
    const squares = container.querySelectorAll('.squares');
    squares.forEach(square => {
        square.style.backgroundColor = '';
    });
});