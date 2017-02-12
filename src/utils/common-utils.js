function offsetX(d) {
    if (d === null || d.id === 'app') {
        return 0;
    } else {
        return d.offsetLeft + offsetX(d.offsetParent);
    }
}
function offsetY(d) {
    if (d === null || d.id === 'app') {
        return 0;
    } else {
        return d.offsetTop + offsetY(d.offsetParent);
    }
}

export const offset = {
    x: offsetX,
    y: offsetY,
};