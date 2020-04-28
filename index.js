const macadam = require("@rezonant/macadam")
const fs = require("fs")

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
    const rgbabitmap = fs.readFileSync("bgrabitmap.bmp")

    // Insert magic here to go to YUV, ideally with gpu
    const yuv = Buffer.alloc(1920 * 1080 * 3)

    for ( let x = 0 ; x < 500 ; x++ ) {
        // Display for 500 frames then quit
        await playback.displayFrame(yuv);
        await timer(1000/50);
    }
}

startPlayback()