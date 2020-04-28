const beamcoder = require('beamcoder');

let decoder = beamcoder.decoder({ name: 'r210', width: 1920, height: 1080 });
let encoder = beamcoder.encoder({ name: 'v210', width: 1920, height: 1080, pix_fmt: 'yuv422p' });

// let dec_result = await decoder.decode(packet);

// let flush_result = await decoder.flush();

async function rgbtoyuv(bitmap) {
    // let packet = await beamcoder.packet({ data: bitmap });
    // console.log(packet)
    // let decoded = await decoder.decode([packet]);

    let frame = beamcoder.frame({ width: 1920, height: 1920, data: [bitmap] });
    // let packet = beamcoder.packet({ data: frame })

    // console.log(decoded)
    let encoded = await encoder.encode();
    console.log(encoded)
    // await decoder.flush();
    return encoded
}

module.exports = rgbtoyuv
  

// async function run() {
//     let demuxer = await beamcoder.demuxer('/path/to/file.mp4'); // Create a demuxer for a file
//     let decoder = beamcoder.decoder({ name: 'h264' }); // Codec asserted. Can pass in demuxer.
//     let packet = {};
//     for ( let x = 0 ; x < 1000 && packet != null ; x++ ) {
//       packet = await format.read(); // Read next frame. Note: returns null for EOF
//       if (packet && packet.stream_index === 0) { // Check demuxer to find index of video stream
//         let frames = await decoder.decode(packet);
//         // Do something with the frame data
//         console.log(x, frames.total_time); // Optional log of time taken to decode each frame
//       }
//     }
//     let frames = await decoder.flush(); // Must tell the decoder when we are done
//     console.log('flush', frames.total_time, frames.length);
//   }
  
//   run();