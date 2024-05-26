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

let frames = require('./framse.json')
let availableFrames = Object.keys(frames);
