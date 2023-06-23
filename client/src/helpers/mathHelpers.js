export function getLinear(minY, maxY, minX, maxX, curX) {
    const gradient = (maxY - minY) / (maxX - minX) // m
    const b = maxY - gradient * maxX
    return Math.min(Math.max(gradient * curX + b, minY), maxY)
}