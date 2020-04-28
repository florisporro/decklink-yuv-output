const fs = require("fs")

const convertBGRAToYUV4228bit = require("./converters/convertBGRAtoYUV4228bit")

function timer(t) {
return new Promise((f, r) => {
    setTimeout(f, t);
});
}

async function startPlayback() {
    // Normally frames would be provided at 60hz by Electron rendering BGRA output from an HTML page
    // Instead of this we provide a BGRA bitmap from file
    const rgbabitmap = fs.readFileSync("bgrabitmap.bmp")
    
    for ( let x = 0 ; x < 10 ; x++ ) {
        
        // Insert magic here to convert BGRA to YUV using the GPU:
        const yuv = convertBGRAToYUV4228bit(1920, 1080, rgbabitmap)
        
        // Now check if the output matches what we are expecting to receive
        const expected_output = fs.readFileSync("convertedToYUV4228bit.bmp")
        console.log(Buffer.compare(yuv, expected_output) ? "Conversion unsuccesful" : "Correct!")

        await timer(200);
    }
}

startPlayback()