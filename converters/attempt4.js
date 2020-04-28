const { GPU } = require('gpu.js');
const gpu = new GPU();

const { rgb2ycbcrMatrix, matrixFlatten } = require("./attempt3")

const yuvmatrix = rgb2ycbcrMatrix('709', 8, 0, 255, 2)

console.log(yuvmatrix)

const flattenedYUVMatrix = matrixFlatten(yuvmatrix)

console.log(flattenedYUVMatrix)

const width = 1920
const height = 1080

const multiplyMatrixes = gpu.createKernel(function(a, b) {
    let sum = 0;
    for (let i = 0; i < this.constants.width; i++) {
        sum += a[this.thread.y][i] * b[i][this.thread.x];
    }
    return sum;
})
.setOutput([width, height, 6])
.setConstants({
    width,
    height
});

const rgb2ycbcr = rgb => {
    return multiplyMatrixes(rgb, flattenedYUVMatrix);
}

module.exports = rgb2ycbcr