// HTML elements
const left = document.getElementById('left');
const right = document.getElementById('right');

// PIXI applications
const leftApp = new PIXI.Application({ width: window.innerWidth / 2, height: window.innerHeight });
const rightApp = new PIXI.Application({ width: window.innerWidth / 2, height: window.innerHeight });

// Graphics objects
let leftGraphics = new PIXI.Graphics();
let rightGraphics = new PIXI.Graphics();

// Append views to DOM
left.appendChild(leftApp.view);
leftApp.stage.addChild(leftGraphics);

right.appendChild(rightApp.view);
rightApp.stage.addChild(rightGraphics);

// Import frames
let frames = require('./frames.json');
let availableFrames = Object.keys(frames);

// Delay function
const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};

// Resize event handler
function resizeCanvases() {
    const width = window.innerWidth / 2;
    const height = window.innerHeight;

    leftApp.renderer.resize(width, height);
    rightApp.renderer.resize(width, height);

    leftGraphics.clear();
    rightGraphics.clear();

    handleFrame(left, width, height);
    handleFrame(right, width, height);
}

// Handle frame
function handleFrame(element, width, height) {
    if (!element.getAttribute('frame')) {
        element.setAttribute('frame', getFrame(availableFrames));
    }

    let frame = element.getAttribute('frame');
    let isLeft = element.id === 'left';

    let graphics = isLeft ? leftGraphics : rightGraphics;

    graphics.clear();
    drawBackground(isLeft, frame, graphics, width, height);
}

// Draw background
function drawBackground(isLeft, frame, graphics, width, height) {
    graphics.beginFill(0xFFF);
    graphics.drawRect(0, 0, width - (isLeft ? 10 : 0), height);
    graphics.endFill();
}

// Initialize and resize on window resize
window.addEventListener('resize', resizeCanvases);
resizeCanvases();

// Function to get a random frame
function getFrame(frames) {
    const randomIndex = Math.floor(Math.random() * frames.length);
    return frames[randomIndex];
}
