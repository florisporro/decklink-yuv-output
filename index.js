const macadam = require("@rezonant/macadam")
const fs = require("fs")

const BGRAtoRGB = require("./converters/BGRAtoRGB")
const rgbtoyuv = require("./converters/attempt5")

let playback;

async function initializePlayback() {
    if (!playback) {
        playback = await macadam.playback({
            deviceIndex: 0,
            displayMode: macadam.bmdModeHD1080i50,
            pixelFormat: macadam.bmdFormat8BitYUV
            // pixelFormat: macadam.bmdFormat10BitYUV
            // pixelFormat: macadam.bmdFormat8BitRGB
            // pixelFormat: macadam.bmdFormat8BitBGRA
        });
    }
}

function timer(t) {
return new Promise((f, r) => {
    setTimeout(f, t);
});
}

async function startPlayback() {
    await initializePlayback()
    const HDbgrabitmap = fs.readFileSync("bgrabitmap.bmp")

    // First go from BGRA to RGB, simple operation
    const rgb = BGRAtoRGB(1920, 1080, HDbgrabitmap)

    // Insert magic here to go to YUV, ideally with gpu
    // const yuv = await rgbtoyuv(rgb)
    const yuv = await rgbtoyuv(rgb)

    for ( let x = 0 ; x < 500 ; x++ ) {
        // Display for 500 frames then quit
        console.log(x)
        await playback.displayFrame(yuv);
        await timer(1000/50);
    }
}

startPlayback()