const fs = require("fs")

const convertBGRAToYUV4228bit = require("./converters/convertBGRAtoYUV4228bit")

class Measurement {
    constructor(interval) {
        this.i = 0
        this.emitChange = 0
        this.interval = interval || 1
        
        this.startTime = new Date()
    }
    
    takeMeasurement() {
        this.i++;
        this.emitChange++;
        
        if (this.emitChange === this.interval) {
            let totalTime = new Date() - this.startTime;
            totalTime /= 1000;
            const period = totalTime / 100;
            const hz = 1 / period;
            this.startTime = new Date();
            this.emitChange = 0;
            return { hz, i: this.i }
        }
        return { i: this.i }
    }
}

function timer(t) {
    return new Promise((f, r) => {
        setTimeout(f, t);
    });
}

async function startPlayback() {
    // Normally frames would be provided at 60hz by Electron rendering BGRA output from an HTML page
    // Instead of this we provide a BGRA bitmap from file
    const rgbabitmap = fs.readFileSync("bgrabitmap.bmp")
    const timer = new Measurement(100)
    
    for ( let x = 0 ; x < 400 ; x++ ) {
        
        // Insert magic here to convert BGRA to YUV using the GPU:
        const yuv = convertBGRAToYUV4228bit(1920, 1080, rgbabitmap)
        
        // Now check if the output matches what we are expecting to receive
        const expected_output = fs.readFileSync("convertedToYUV4228bit.bmp")

        const isEqual = Buffer.compare(yuv, expected_output) === 0
        
        const timing = timer.takeMeasurement()
        if (timing.hz) {
            console.log(`Speed: ${timing.hz}hz - conversion: ${isEqual ? "Good" : "Problem"}`)
            if (timing.hz > 60) {
                console.log("Target speed achieved!")
            }
        }
    }
}

startPlayback()