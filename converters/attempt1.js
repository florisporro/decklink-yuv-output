function convertRGBAToYUV422 (width, height, data) {
    // BT.709 or BT.601
    const KR = height >= 720 ? 0.2126 : 0.299
    const KB = height >= 720 ? 0.0722 : 0.114
    const KG = 1 - KR - KB

    const KRi = 1 - KR
    const KBi = 1 - KB

    const YRange = 219
    const CbCrRange = 224
    const HalfCbCrRange = CbCrRange / 2

    const YOffset = 16 << 8
    const CbCrOffset = 128 << 8

    const KRoKBi = KR / KBi * HalfCbCrRange
    const KGoKBi = KG / KBi * HalfCbCrRange
    const KBoKRi = KB / KRi * HalfCbCrRange
    const KGoKRi = KG / KRi * HalfCbCrRange

    const genColor = (rawA, uv16, y16) => {
        const a = ((rawA << 2) * 219 / 255) + (16 << 2)
        const y = Math.round(y16) >> 6
        const uv = Math.round(uv16) >> 6

        return (a << 20) + (uv << 10) + y
    }

    const buffer = Buffer.alloc(width * height * 4)
    for (let i = 0; i < width * height * 4; i += 6) {
        const r1 = data[i + 0]
        const g1 = data[i + 1]
        const b1 = data[i + 2]

        const r2 = data[i + 4]
        const g2 = data[i + 5]
        const b2 = data[i + 6]

        const a1 = data[i + 3]
        const a2 = data[i + 7]

        const y16a = YOffset + KR * YRange * r1 + KG * YRange * g1 + KB * YRange * b1
        const cb16 = CbCrOffset + (-KRoKBi * r1 - KGoKBi * g1 + HalfCbCrRange * b1)
        const y16b = YOffset + KR * YRange * r2 + KG * YRange * g2 + KB * YRange * b2
        const cr16 = CbCrOffset + (HalfCbCrRange * r1 - KGoKRi * g1 - KBoKRi * b1)

        // const y = Math.round(y16a) >> 6
        // const uv = Math.round(uv16) >> 6

        // buffer[0 + i] = Math.round(y16a) >> 6
        // buffer[1 + i] = cb16
        // buffer[2 + i] = cb16
        // buffer[3 + i] = Math.round(y16b) >> 6
        // buffer[4 + i] = cr16
        // buffer[5 + i] = cr16

        buffer.writeUInt32BE(genColor(a1, cb16, y16a), i)
        buffer.writeUInt32BE(genColor(a2, cr16, y16b), i + 4)
    }
    return buffer
}

module.exports = convertRGBAToYUV422