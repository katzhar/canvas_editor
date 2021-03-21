let canvas,
    context,
    is_drawing = false,
    drawColor = 'black',
    drawWidth = '10',
    dragStartLocation,
    snapshot,
    bezierCoords = [];

canvas = document.getElementById('canvas');
canvas.width = 850;
canvas.height = 500;
context = canvas.getContext('2d');
context.fillStyle = 'white';

context.fillRect(0, 0, canvas.width, canvas.height);
context.lineWidth = 4;
context.lineCap = 'round';

const getCanvasCoordinates = (event) => {
    var x = event.clientX,
        y = event.clientY;
    return { x: x, y: y };
}

const takeSnapshot = () => {
    snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
}

const restoreSnapshot = () => {
    context.putImageData(snapshot, 0, 0);
}

const start = (event) => {
    is_drawing = true;
    context.strokeStyle = drawColor;
    context.lineWidth = drawWidth;
    context.beginPath();
    context.moveTo(event.clientX, event.clientY);
    dragStartLocation = getCanvasCoordinates(event);
    takeSnapshot();
    event.preventDefault();
}

const drag = (event) => {
    if (is_drawing === true) {
        restoreSnapshot();
        currentPosition = getCanvasCoordinates(event);
        drawShapes(currentPosition);
    }
}

const drawShapes = (currentPosition) => {
    let shape = localStorage.getItem('shape');
    fillBox = document.getElementById('fillBox');
    if (shape === 'random') {
        drawRandomLine(currentPosition);
    }
    if (shape === 'circle') {
        drawCircle(currentPosition);
    }
    if (shape === 'curve') {
        drawBezierCurve(currentPosition);
    }
    if (shape === 'polygon') {
        drawPolygon(currentPosition);
    }
    if (fillBox.checked && shape !== 'random') {
        context.fillStyle = drawColor;
        context.fill();
    } else {
        context.stroke();
    }
}

const drawRandomLine = (currentPosition) => {
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineTo(currentPosition.x, currentPosition.y);
    context.stroke();
}

const drawBezierCurve = (currentPosition) => {
    context.beginPath();
    context.moveTo(dragStartLocation.x, dragStartLocation.y);
    context.quadraticCurveTo(dragStartLocation.x - 100, dragStartLocation.y - 100, currentPosition.x, currentPosition.y);
    context.stroke();
}

const drawCircle = (currentPosition) => {
    var radius = Math.sqrt(Math.pow((dragStartLocation.x - currentPosition.x), 2) + Math.pow((dragStartLocation.y - currentPosition.y), 2));
    context.beginPath();
    context.arc(dragStartLocation.x, dragStartLocation.y, radius, 0, 2 * Math.PI, false);
}

const drawPolygon = (currentPosition) => {
    let angle = Math.PI / 4;
    let sides = document.getElementById('polygonSides').value;
    let coordinates = [],
        radius = Math.sqrt(Math.pow((dragStartLocation.x - currentPosition.x), 2) + Math.pow((dragStartLocation.y - currentPosition.y), 2)),
        index = 0;
    for (index = 0; index < sides; index++) {
        coordinates.push({ x: dragStartLocation.x + radius * Math.cos(angle), y: dragStartLocation.y - radius * Math.sin(angle) });
        angle += (2 * Math.PI) / sides;
    }
    context.beginPath();
    context.moveTo(coordinates[0].x, coordinates[0].y);
    for (index = 1; index < sides; index++) {
        context.lineTo(coordinates[index].x, coordinates[index].y);
    }
    context.closePath();
}

const stop = (event) => {
    if (is_drawing) {
        context.stroke();
        context.closePath();
        is_drawing = false;
    }
    event.preventDefault();
}

const onClear = () => {
    context.fillStyle = 'white';
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener('keydown', onKeyDown = (e) => {
    if (e.keyCode === 49) {
        localStorage.setItem("shape", "random")
    } if (e.keyCode === 50) {
        localStorage.setItem("shape", "curve")
    } if (e.keyCode === 51) {
        localStorage.setItem("shape", "circle")
    } if (e.keyCode === 52) {
        localStorage.setItem("shape", "polygon")
    } if (e.keyCode === 53) {
        localStorage.setItem("shape", "dragndrop")
    } if (e.keyCode === 67) {
        onClear();
    }
    drag();
})

canvas.addEventListener('mousedown', start, false);
canvas.addEventListener('mousemove', drag, false);
canvas.addEventListener('touchend', stop, false);
canvas.addEventListener('mouseup', stop, false);
canvas.addEventListener('mouseout', stop, false);
