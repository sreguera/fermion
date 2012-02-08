var craft = {x: 0, y: 0, vx: 0, vy: 0, r: 10, engineOn: false};
var GRAVITY_ACC = 10;
var ENGINE_ACC = 15;
var MAX_V = 10;
var TIME_STEP = 0.025;
var intervalId;

var animate = function() {
    var ay = GRAVITY_ACC;
    if (craft.engineOn) {
        ay = ay - ENGINE_ACC;
    }
    craft.vy = craft.vy + ay * TIME_STEP;
    craft.y = craft.y + craft.vy * TIME_STEP;
}

var drawCraft = function(ctx) {
    var r = craft.r
    ctx.fillRect(craft.x - r, craft.y - r, 2 * r, 2 * r);
    if (craft.engineOn) {
        ctx.beginPath();
        ctx.moveTo(craft.x,     craft.y + r);
        ctx.lineTo(craft.x - r, craft.y + r + 2 * r);
        ctx.moveTo(craft.x,     craft.y + r);
        ctx.lineTo(craft.x + r, craft.y + r + 2 * r);
        ctx.stroke();
    }
}

var init = function() {
    intervalId = setInterval(draw, TIME_STEP * 1000);
    var canvas = document.getElementById('canvas');
    craft.x = canvas.width / 2;
    craft.y = craft.r;
}

var draw = function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    animate();
    drawCraft(ctx);

    if (craft.y > canvas.height - craft.r) {
        clearInterval(intervalId);
        var message;
        if (craft.vy > MAX_V) {
            message = "CRASH!";
        } else {
            message = "GOOD LANDING!";
        }
        var textSize = ctx.measureText(message);
        ctx.fillText(message, 
                     canvas.width / 2 - textSize.width / 2,
                     canvas.height / 2);
    }
}

var DOWN_ARROW = 40

var onKeyDown = function(event) {
    switch (event.keyCode) {
    case DOWN_ARROW:
        craft.engineOn = true;
        break;
    }
}

var onKeyUp = function(event) {
    switch (event.keyCode) {
    case DOWN_ARROW:
        craft.engineOn = false;
        break;
    }
}

document.onkeydown = onKeyDown;
document.onkeyup = onKeyUp;