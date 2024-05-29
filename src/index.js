const left = document.getElementById('left');
const right = document.getElementById('right');

const leftApp = new PIXI.Application();
const rightApp = new PIXI.Application();

let leftVideoContainer = new PIXI.Container();
let rightVideoContainer = new PIXI.Container();

let leftVideo = new PIXI.Sprite();
let rightVideo = new PIXI.Sprite();

leftVideoContainer.addChild(leftVideo);
rightVideoContainer.addChild(rightVideo);

leftApp.stage.addChild(leftVideoContainer);
rightApp.stage.addChild(rightVideoContainer);

left.appendChild(leftApp.view);
right.appendChild(rightApp.view);

let frames = {};
let availableFrames = [];

async function fetchFrames() {
    try {
        let response = await fetch('./frame.json');
        frames = await response.json();
        availableFrames = Object.keys(frames);
        resizeCanvases();
    } catch (error) {
        console.error('Error fetching frames:', error);
    }
}

fetchFrames();

function resizeCanvases() {
    const width = window.innerWidth / 2;
    const height = window.innerHeight;

    leftApp.renderer.resize(width, height);
    rightApp.renderer.resize(width, height);

    handleFrame(left, width, height);
    handleFrame(right, width, height);
}

function handleFrame(element, width, height) {
    if (!element.getAttribute('frame')) {
        element.setAttribute('frame', getFrame());
    }

    let frame = element.getAttribute('frame');
    let isLeft = element.id === 'left';

    let app = isLeft ? leftApp : rightApp;

    app.renderer.backgroundColor = frames[frame].colour.background;
    video(isLeft, width, height, frame, app);
}

function getFrame() {
    if (availableFrames.length === 0) {
        console.error('No available frames left.');
        return null;
    }

    const index = Math.floor(Math.random() * availableFrames.length);
    const frame = availableFrames[index];
    availableFrames.splice(index, 1);
    return frame;
}

function video(isLeft, width, height, frame, app) {
    let videoPath = frames[frame]["video"];
    let videoTexture = PIXI.Texture.from(videoPath);

    let element = isLeft ? leftVideo : rightVideo;

    element.texture = videoTexture;
    element.anchor.set(0.5);
    element.x = app.renderer.width / 2;
    element.y = app.renderer.height / 2;

    element.width = width / 2;
    element.height = height / 4;

    element.interactive = true;
    let videoElement = element.texture.baseTexture.resource.source;


    videoElement.setAttribute("data-isPaused", "true");

    videoElement.addEventListener('loadedmetadata', () => {
        togglePlayPause(videoElement);
    });

    element.on('pointerdown', () => {
        togglePlayPause(videoElement);
    });
}

function togglePlayPause(videoElement) {
    let isPaused = videoElement.getAttribute("data-isPaused") === "true";
    if (isPaused) {
        videoElement.play();
        videoElement.setAttribute("data-isPaused", "false");
    } else {
        videoElement.pause();
        videoElement.setAttribute("data-isPaused", "true");
    }
}

window.addEventListener('resize', resizeCanvases);
