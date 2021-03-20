let canvas,
    context,
    is_drawing = false,
    draw_color = 'black',
    draw_width = '20',
    dragStartLocation,
    snapshot;

canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 60,
    canvas.height = 500;
context = canvas.getContext('2d');
context.fillStyle = 'white';

context.fillRect(0, 0, canvas.width, canvas.height);
context.lineWidth = 4;
context.lineCap = 'round';

const getCanvasCoordinates = (event) => {
    var x = event.clientX - canvas.getBoundingClientRect().left,
        y = event.clientY - canvas.getBoundingClientRect().top;
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
    context.strokeStyle = draw_color;
    context.lineWidth = draw_width;
    context.beginPath();
    context.moveTo(event.clientX, event.clientY);
    dragStartLocation = getCanvasCoordinates(event);
    takeSnapshot();
    event.preventDefault();
}

const drag = (event) => {
    let position;
    if (is_drawing === true) {
        restoreSnapshot();
        position = getCanvasCoordinates(event);
        drawShapes(position);
    }
}

const drawShapes = (position) => {
    let shape = localStorage.getItem('shape');
    let fillBox = document.getElementById('fillBox');
    if (shape === 'random') {
        drawRandom(position);
    }
    if (shape === 'circle') {
        drawCircle(position);
    }
    if (shape === 'line') {
        drawLine(position);
    }
    if (shape === 'polygon') {
        drawPolygon(position);
    }
    if (fillBox.checked && shape !== 'random') {
        context.fillStyle = draw_color
        context.fill();
    } else {
        context.stroke();
    }
}

const drawRandom = (position) => {
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineTo(position.x, position.y);
    context.stroke();
}

const drawLine = (position) => {
    context.beginPath();
    context.moveTo(dragStartLocation.x, dragStartLocation.y);
    context.lineTo(position.x, position.y);
    context.stroke();
}

const drawCircle = (position) => {
    var radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2));
    context.beginPath();
    context.arc(dragStartLocation.x, dragStartLocation.y, radius, 0, 2 * Math.PI, false);
}

const drawPolygon = (position) => {
    let angle = Math.PI / 4;
    let sides = document.getElementById('polygonSides').value;
    let coordinates = [],
        radius = Math.sqrt(Math.pow((dragStartLocation.x - position.x), 2) + Math.pow((dragStartLocation.y - position.y), 2)),
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

const change_color = (elem) => {
    context.strokeStyle = elem.style.background;
}

const clear_canvas = () => {
    context.fillStyle = 'white';
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('mousedown', start, false);
canvas.addEventListener('mousemove', drag, false);
canvas.addEventListener('touchend', stop, false);
canvas.addEventListener('mouseup', stop, false);
canvas.addEventListener('mouseout', stop, false);
