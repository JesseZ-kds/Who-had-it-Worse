const canvasElement = document.getElementById("game");
const app = new PIXI.Application({ view: canvasElement });

let graphics = new PIXI.Graphics();
let textContainer = new PIXI.Container();
let imgContainer = new PIXI.Container();

app.stage.addChild(graphics);
app.stage.addChild(textContainer);
app.stage.addChild(imgContainer);

let frames = {};
let availableFrames = [];
let frameInUse = [];

// Create a new PIXI.Loader instance
const loader = new PIXI.Loader();

async function loadAssets() {
    try {
        await new Promise((resolve, reject) => {
            loader.add('logo', '../img/logo.png').load((loader, resources) => {
                resolve(resources);
            });
        });
        console.log(loader.resources.logo.texture);
    } catch (error) {
        console.error('Error loading assets:', error);
    }
}

async function fetchFrames() {
    try {
        let response = await fetch('./frame.json');
        frames = await response.json();
        availableFrames = Object.keys(frames);
        resizeApp();
    } catch (error) {
        console.error('Error fetching frames:', error);
    }
}

fetchFrames();
loadAssets(); // Call loadAssets to start loading the logo

function resizeApp() {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    app.renderer.resize(screenWidth, screenHeight);
    graphics.clear();
    textContainer.removeChildren();

    // Redraw frames and intro on resize
    handleFrames(screenWidth, screenHeight);
    drawIntro(screenWidth, screenHeight);
}

function handleFrames(width, height) {
    graphics.removeChildren(); // Clear previous frame drawings

    if (frameInUse.length === 2) {
        drawFrame(width, height, frames[frameInUse[0]], true);
        drawFrame(width, height, frames[frameInUse[1]], false);
    } else {
        let frame1 = getFrame();
        let frame2 = getFrame();
        drawFrame(width, height, frames[frame1], true);
        drawFrame(width, height, frames[frame2], false);
    }
}

function drawFrame(width, height, frame, isFirst) {
    if (!frame) return;

    let color = rgb(frame.colour.r, frame.colour.g, frame.colour.b);
    graphics.beginFill(color);

    if (width > height) {
        if (isFirst) {
            graphics.drawRect(0, 0, width / 2, height);
        } else {
            graphics.drawRect(width / 2, 0, width / 2, height);
        }
    } else {
        if (isFirst) {
            graphics.drawRect(0, 0, width, height / 2);
        } else {
            graphics.drawRect(0, height / 2, width, height / 2);
        }
    }

    graphics.endFill();
}

function drawIntro(width, height) {
    graphics.beginFill(0x000000, 0.5);
    graphics.drawRect(0, 0, width, height);
    graphics.endFill();

    let sWidth = width / 3;
    let sHeight = height / 2;
    let cornerRadius = 20;

    graphics.beginFill(0x000000);
    graphics.drawRoundedRect(width / 2 - sWidth / 2, height / 2 - sHeight / 2, sWidth, sHeight, cornerRadius);
    graphics.endFill();

    // Text styles
    let titleStyle = { fontFamily: 'Arial', fontSize: Math.floor(width * height / 50000), fill: 'white', align: 'center', fontStyle: 'italic' };
    let mainTextStyle = { fontFamily: 'Arial', fontSize: Math.floor(width * height / 75000), fill: 'white', align: 'center', fontStyle: 'italic' };

    // Title text
    let titleText = new PIXI.Text('Who had it Worse?', new PIXI.TextStyle(titleStyle));
    titleText.anchor.set(0.5);
    titleText.position.set(width / 2, height / 2 - sHeight / 4);

    // Main text
    let mainText = new PIXI.Text("It's Simple. \n Watch the 2 Ted Talks. \n Compare them and choose \n \"Who had it Worse?\"", new PIXI.TextStyle(mainTextStyle));
    mainText.anchor.set(0.5);
    mainText.position.set(width / 2, height / 2);

    textContainer.addChild(titleText, mainText);
}

function getFrame() {
    if (availableFrames.length === 0) {
        console.error('No available frames left.');
        return null;
    }

    const index = Math.floor(Math.random() * availableFrames.length);
    const frame = availableFrames[index];
    availableFrames.splice(index, 1);
    frameInUse.push(frame);
    return frame;
}

function rgb(r, g, b) {
    return (r << 16) + (g << 8) + b;
}

window.addEventListener('resize', resizeApp);
