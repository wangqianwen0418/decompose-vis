export const offset = {
    x(d) {
        if (d === null) {
            return 0;
        } else {
            return d.offsetLeft + offsetX(d.offsetParent);
        }
    },
    y(d) {
        if (d === null) {
            return 0;
        } else {
            return d.offsetTop + offsetY(d.offsetParent);
        }
    },
};