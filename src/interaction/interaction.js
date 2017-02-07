import * as d3 from 'd3';

export function interactionInit() {
    document.addEventListener('click', onClick);
    document.addEventListener('drag', onDrag);
    document.addEventListener('dragstart', onDragstart);
    document.addEventListener('dragend', onDragend);
    document.addEventListener('dragover', onDragover);
    document.addEventListener('mouseup', onmouseenter);
}

let dragstartLeft = -1;
let dragstartTop = -1;

function onmouseenter(event) {
    if (event.target.tagName === "DIV") {
        console.log("onmouseenter", event);
    }
    return;
}

function onClick(event) {
    //console.log(event);
    return;
}

function onDragstart(event) {
    if (event.target.tagName === "DIV") {
    }
    return;
}

function onDragend(event) {
    if (event.target.tagName === "DIV") {
        console.log(event);
    }
    return;
}

function onDrag(event) {
    if (event.target.tagName === "DIV") {
    }
    return;
}

function onDragover(event) {
    event.preventDefault();
}
