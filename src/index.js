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

    drawBackground(frame, graphics, isLeft)
    drawRandomCircles(graphics, 40, 75, 150, frames[frame].colour.circle, app.renderer);
    displayText(graphics, frame, frames[frame].colour.text, height / 2, width, width / 20);
    displayText(graphics, `Did ${frames[frame].person} have it worse?`, frames[frame].colour.text, height * 1.5, width, width / 25);
    displayText(graphics, frames[frame].text, frames[frame].colour.text, height, width, width / 35);

}
