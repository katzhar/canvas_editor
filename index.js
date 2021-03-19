const canvas = document.getElementById('canvas');
canvas.width = window.innerWidth - 60,
canvas.height = 700;

let context = canvas.getContext('2d');
context.fillStyle = 'white';
context.fillRect(0, 0, canvas.width, canvas.height);

let draw_color = 'black';
let draw_width = '20';
let is_drawing = false;

const start = (event) => {
    is_drawing = true;
    context.beginPath();
    context.moveTo(event.clientX, event.clientY);
    event.preventDefault();
} 

const draw = (event) => {
    if (is_drawing) {
        context.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
        context.strokeStyle = draw_color;
        context.lineWidth = draw_width;
        context.lineCap = 'round';
        context.lineJoin = 'round';
        context.stroke();
    }
    event.preventDefault();
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
    draw_color = elem.style.background;
}

const clear_canvas = () => {
    context.fillStyle = 'white';
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
}

const undo_action = () => {
    context.fillStyle = 'white';
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillRect(0, 0, canvas.width, canvas.height);
}

canvas.addEventListener('touchstart', start, false);
canvas.addEventListener('touchmove', draw, false);
canvas.addEventListener('mousedown', start, false);
canvas.addEventListener('mousemove', draw, false);

canvas.addEventListener('touchend', stop, false);
canvas.addEventListener('mouseup', stop, false);
canvas.addEventListener('mouseout', stop, false);

