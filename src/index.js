document.addEventListener('DOMContentLoaded', function() {
    const canvasElement = document.getElementById("game");
    const app = new PIXI.Application({ view: canvasElement });

    let graphics = new PIXI.Graphics();
    let text = new PIXI.Container();
    app.stage.addChild(graphics);
    app.stage.addChild(text);

    let frames = {};
    let availableFrames = [];
    let frameInUse = [];

    let intro = true;

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

    function resizeApp() {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;

        app.renderer.resize(screenWidth, screenHeight);
        graphics.clear();
        text.removeChildren();

        // Redraw frames and intro on resize
        handleFrames(screenWidth, screenHeight);
        if (intro)
            drawIntro(screenWidth, screenHeight);
        else runGame();
    }

    function handleFrames(width, height) {
        graphics.removeChildren();

        if (frameInUse.length === 2) {
            drawFrame(width, height, frames[frameInUse[0]], true);
            drawFrame(width, height, frames[frameInUse[1]], false);
        } else {
            let frame1 = getFrame();
            let frame2 = getFrame();
                drawFrame(width, height, frames[frame1], true);
            if (frame2) {
                drawFrame(width, height, frames[frame2], false);
            }
        }
    }

    function drawFrame(width, height, frame, isFirst) {
        if (!frame) return;

        let color = frame.colour.background;
        graphics.beginFill(color);
        
        if (width > height) { //Horizontal vs Vertical
            if (isFirst) {
                graphics.drawRect(0, 0, width / 2, height); //0 to Mid
            } else {
                graphics.drawRect(width / 2, 0, width / 2, height); //Mid to End
            }
        } else {
            if (isFirst) {
                graphics.drawRect(0, 0, width, height / 2); //0 to Mid (height)
            } else {
                graphics.drawRect(0, height / 2, width, height / 2); //Mid to End (height)
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

        let credit = new PIXI.Text("Developed by Jesse Zelman", new PIXI.TextStyle(mainTextStyle));
        credit.anchor.set(0.5);
        credit.position.set(width / 2, height / 1.5);

        text.addChild(titleText, mainText, credit);
    }

    function toggleIntro() {
        intro = false; // Set intro to false when clicked
        resizeApp(); // Redraw the app without intro
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

    function clickFunc() {
        if (intro) {
            intro = false; // Set intro to false when clicked
            resizeApp(); // Redraw the app without intro
        }
    }

    function runGame() {

    }

    canvasElement.addEventListener('click', clickFunc);

    window.addEventListener('resize', resizeApp);
});
