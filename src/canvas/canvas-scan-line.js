export function ScanLine(points) {
    const h = new Map();
    for (let i = 0; i < points.length; i += 2) {
        if (!h[points[i]]) {
            h[points[i]] = [];
        }
        h[points[i]].push(points[i + 1]);
    }
    
}