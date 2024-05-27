const left = document.getElementById('left');
const leftApp = new PIXI.Application();
let leftGraphics = new PIXI.Graphics();

const right = document.getElementById('right');
const rightApp = new PIXI.Application();
let rightGraphics = new PIXI.Graphics();

left.appendChild(leftApp.view);
leftApp.stage.addChild(leftGraphics);

right.appendChild(rightApp.view);
rightApp.stage.addChild(rightGraphics);

//

const delay = (delayInms) => {
  return new Promise(resolve => setTimeout(resolve, delayInms));
};

const width = window.innerWidth / 2;
const height = window.innerHeight;

let frames = require('./framse.json')
let availableFrames = Object.keys(frames);

//

function resizeCanvases() {
    leftApp.renderer.resize(width, height);
    rightApp.renderer.resize(width, height);

    leftGraphics.clear();
    rightGraphics.clear();

    handleFrame(left);
    handleFrame(right);
}

function handleFrame(element) {
    if (!element.getAttribute('frame'))
        element.setAttribute('frame', getFrame(availableFrames));

    let frame = element.getAttribute('frame');
    let isLeft = element.id === 'left';

    let app = isLeft ? leftApp : rightApp;
    let graphics = isLeft ? leftGraphics : rightGraphics;

    graphics.removeChildren();
    graphics.clear();

    drawBackground(isLeft, frame, graphics);
}

function drawBackground(isLeft, frame, graphics){
    for (let h = 0; h <= height; h++) {
        graphics.beginFill(0xFFF);
        if (isLeft)
            graphics.drawRect(0, 0, width - 10, h)

        await delay(100)
    }
}
