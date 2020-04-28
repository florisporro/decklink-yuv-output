function BGRAtoYUV(width, height, data) {
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

	const KRoKBi = (KR / KBi) * HalfCbCrRange
	const KGoKBi = (KG / KBi) * HalfCbCrRange
	const KBoKRi = (KB / KRi) * HalfCbCrRange
	const KGoKRi = (KG / KRi) * HalfCbCrRange

	const buffer = Buffer.alloc(width * height * 4)
	let i = 0
	while (i < width * height * 4) {
		const r1 = data[i + 2]
		const g1 = data[i + 1]
		const b1 = data[i + 0]

		const r2 = data[i + 6]
		const g2 = data[i + 5]
		const b2 = data[i + 4]

		const a1 = ((data[i + 3] << 2) * 219) / 255 + (16 << 2)
		const a2 = ((data[i + 7] << 2) * 219) / 255 + (16 << 2)

		const y16a =
			YOffset + KR * YRange * r1 + KG * YRange * g1 + KB * YRange * b1
		const cb16 = CbCrOffset + (-KRoKBi * r1 - KGoKBi * g1 + HalfCbCrRange * b1)
		const y16b =
			YOffset + KR * YRange * r2 + KG * YRange * g2 + KB * YRange * b2
		const cr16 = CbCrOffset + (HalfCbCrRange * r1 - KGoKRi * g1 - KBoKRi * b1)

		const y1 = Math.round(y16a) >> 6
		const u1 = Math.round(cb16) >> 6
		const y2 = Math.round(y16b) >> 6
		const v2 = Math.round(cr16) >> 6

		buffer[i + 0] = a1 >> 4
		buffer[i + 1] = ((a1 & 0x0f) << 4) | (u1 >> 6)
		buffer[i + 2] = ((u1 & 0x3f) << 2) | (y1 >> 8)
		buffer[i + 3] = y1 & 0xff
		buffer[i + 4] = a2 >> 4
		buffer[i + 5] = ((a2 & 0x0f) << 4) | (v2 >> 6)
		buffer[i + 6] = ((v2 & 0x3f) << 2) | (y2 >> 8)
		buffer[i + 7] = y2 & 0xff
		i = i + 8
	}
	return buffer
}

module.exports = BGRAtoYUV