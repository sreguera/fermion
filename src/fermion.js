var craft = {x: 0, y: 0, vx: 0, vy: 0, r: 10, fuel:500, engineOn: false};
var ground = {x: 0, y:0, width:0, height:0}
var GRAVITY_ACC = 10;
var ENGINE_ACC = 15;
var MAX_V = 10;
var TIME_STEP = 0.025;
var intervalId;

var animate = function() {
    var ay = GRAVITY_ACC;
    if (craft.engineOn && craft.fuel > 0) {
        ay = ay - ENGINE_ACC;
        craft.fuel = craft.fuel - 1;
    }
    craft.vy = craft.vy + ay * TIME_STEP;
    craft.y = craft.y + craft.vy * TIME_STEP;
}

var craftCollide = function() {
    if (craft.y + craft.r > ground.y - ground.height / 2) {
        return true;
    } else {
        return false;
    }
}

var drawGround = function(ctx) {
    ctx.fillRect(ground.x - ground.width / 2,
                 ground.y - ground.height / 2,
                 ground.width, ground.height)
}

var drawCraft = function(ctx) {
    var r = craft.r
    ctx.fillRect(craft.x - r, craft.y - r, 2 * r, 2 * r);
    if (craft.engineOn && craft.fuel > 0) {
        ctx.beginPath();
        ctx.moveTo(craft.x,     craft.y + r);
        ctx.lineTo(craft.x - r, craft.y + r + 2 * r);
        ctx.moveTo(craft.x,     craft.y + r);
        ctx.lineTo(craft.x + r, craft.y + r + 2 * r);
        ctx.stroke();
    }
}

var drawHud = function(ctx) {
    var message = "VY: " + craft.vy.toFixed(1);
    ctx.fillText(message, 10, 10);
    var fuelMessage = "FUEL: " + craft.fuel;
    ctx.fillText(fuelMessage, 300, 10);
}

var init = function() {
    intervalId = setInterval(draw, TIME_STEP * 1000);
    var canvas = document.getElementById('canvas');
    craft.x = canvas.width / 2;
    craft.y = craft.r;
    ground.x = canvas.width / 2;
    ground.y = canvas.height - 10;
    ground.width = canvas.width;
    ground.height = 20;
}

var draw = function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    animate();
    drawGround(ctx);
    drawCraft(ctx);
    drawHud(ctx);

    if (craftCollide()) {
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