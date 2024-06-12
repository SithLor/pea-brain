const fs = require('fs');
const { createCanvas } = require('canvas');
const { JSDOM } = require('jsdom');

const dom = new JSDOM(`<!DOCTYPE html><body></body></html>`);
global.window = dom.window;
global.document = window.document;
global.Canvas = createCanvas;

// Define cell size and grid dimensions
const cellSize = 10;
const canvasSize_x = 500;
const canvasSize_y = 500;
const max_iterations = 100*100;
const delay = 0;

const numRows = Math.floor(canvasSize_y / cellSize);
const numCols = Math.floor(canvasSize_x / cellSize);

// Initialize canvas and context
const canvas = createCanvas(canvasSize_x, canvasSize_y);
const ctx = canvas.getContext('2d');

// The rest of the game logic goes here, same as in the HTML file...

// Function to save the current state of the canvas as a PNG
function saveCanvasAsPNG(iteration) {
    const buffer = canvas.toBuffer('image/png');
    fs.writeFileSync(`./data/iteration_${iteration}.png`, buffer);
}


// Function to initialize the grid
function createGrid() {
    const grid = [];
    for (let i = 0; i < numRows; i++) {
        grid[i] = [];
        for (let j = 0; j < numCols; j++) {
            grid[i][j] = Math.
            random() > 0.7 ? 1 : 0; // Random initialization
        }
    }
    return grid;
}

let grid = createGrid();
let isRunning = false;
let animationId = null;

// Function to draw the grid
function drawGrid() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < numRows; i++) {
        for (let j = 0; j < numCols; j++) {
            if (grid[i][j] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(j * cellSize, i *
                             cellSize, cellSize, cellSize);
            }
        }
    }
}

// Function to update the grid based on Conway's rules
function updateGrid() {
    const newGrid = [];
    for (let i = 0; i < numRows; i++) {
        newGrid[i] = [];
        for (let j = 0; j < numCols; j++) {
            const neighbors = countNeighbors(i, j);
            if (grid[i][j] === 1 && (neighbors < 2 || neighbors > 3)) {
                newGrid[i][j] = 0; 
            } else if (grid[i][j] === 0 && neighbors === 3) {
                newGrid[i][j] = 1; 
            } else {
                newGrid[i][j] = grid[i][j]; 
            }
        }
    }
    grid = newGrid;
}

// Function to count live neighbors of a cell
function countNeighbors(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const r = row + i;
            const c = col + j;
            if (r >= 0 && r < numRows && c >= 0 &&
                c < numCols && !(i === 0 && j === 0)) {
                count += grid[r][c];
            }
        }
    }
    return count;
}

// Main loop to update and draw the grid
function mainLoop() {
    updateGrid();
    drawGrid();
    if (isRunning) {
        animationId = requestAnimationFrame(mainLoop);
    }
}





// Modify the mainLoop function to save a PNG on each iteration
let iteration = 0;
function mainLoop() {
    updateGrid();
    drawGrid();
    saveCanvasAsPNG(iteration);
    iteration++;
    if (isRunning) {
        setTimeout(mainLoop, delay); // Delay to simulate requestAnimationFrame
    }
    if (iteration >= max_iterations) {
        isRunning = false;
    }
}

// Start the game
isRunning = true;
mainLoop();