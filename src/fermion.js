/*
  Copyright 2012 Jose Sebastian Reguera Candal

  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.

  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.

  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
var craft = {x: 0, y: 0, vx: 0, vy: 0,
             a: 0, turn: 0, 
             r: 10, 
             fuel:500, engineOn: false};
var ground = {x: 0, y:0, width:0, height:0};
var GRAVITY_ACC = 10;
var ENGINE_THRUST = 20000;
var MAX_VY = 10;
var MAX_VX = 4;
var TIME_STEP = 0.025;
var intervalId;

var animate = function() {
    var ax = 0;
    var ay = GRAVITY_ACC;

    craft.a = craft.a + craft.turn * 0.05;

    if (craft.engineOn && craft.fuel > 0) {
        var acc = ENGINE_THRUST / (500 + craft.fuel);
        ax = ax + acc * Math.sin(craft.a);
        ay = ay - acc * Math.cos(craft.a);
        craft.fuel = craft.fuel - 1;
    }
    craft.vx = craft.vx + ax * TIME_STEP;
    craft.vy = craft.vy + ay * TIME_STEP;
    craft.x = craft.x + craft.vx * TIME_STEP;
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
    ctx.save();
    ctx.translate(craft.x, craft.y);
    ctx.rotate(craft.a);
    var r = craft.r;
    ctx.fillRect(-r, -r, 2 * r, 2 * r);
    if (craft.engineOn && craft.fuel > 0) {
        ctx.beginPath();
        ctx.moveTo(0, r);
        ctx.lineTo(-r, r + 2 * r);
        ctx.moveTo(0, r);
        ctx.lineTo(+r, r + 2 * r);
        ctx.stroke();
    }
    ctx.restore();
}

var drawHud = function(ctx) {
    var vyMessage = "VY: " + craft.vy.toFixed(1);
    ctx.fillText(vyMessage, 10, 10);
    var vxMessage = "VX: " + craft.vx.toFixed(1);
    ctx.fillText(vxMessage, 10, 30);
    var degMessage = "DEG: " + ((craft.a * 180) / Math.PI).toFixed(1);
    ctx.fillText(degMessage, 10, 50);
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
        if (craft.vy > MAX_VY 
            || Math.abs(craft.vx) > MAX_VX
            || (craft.a / (2 * Math.PI)) > 0.1) {
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

var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;

var onKeyDown = function(event) {
    switch (event.keyCode) {
    case LEFT_ARROW:
        craft.turn = -1;
        break;
    case RIGHT_ARROW:
        craft.turn = +1;
        break;
    case DOWN_ARROW:
        craft.engineOn = true;
        break;
    }
}

var onKeyUp = function(event) {
    switch (event.keyCode) {
    case LEFT_ARROW:
        if (craft.turn === -1)
        {
            craft.turn = 0;
        }
        break;
    case RIGHT_ARROW:
        if (craft.turn === +1)
        {
            craft.turn = 0;
        }
        break;
    case DOWN_ARROW:
        craft.engineOn = false;
        break;
    }
}

document.onkeydown = onKeyDown;
document.onkeyup = onKeyUp;