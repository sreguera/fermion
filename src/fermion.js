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

var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var DOWN_ARROW = 40;


var init = function() {
    enterInitState();
}

//======================================================================
// InitState
//======================================================================

var enterInitState = function() {
    document.onkeydown = null;
    document.onkeyup = null;
    document.onkeypress = onKeyPressInit;

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');

    // ctx.fillStyle="rgb(255, 255, 255)"
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx);
    ctx.fillStyle="rgb(20, 20, 20)"

    drawTextCentered("Press SPACE to play");
}

var onKeyPressInit = function(event) {
    enterPlayingState();
}

//======================================================================
// ResultState
//======================================================================

var enterResultState = function() {
    clearInterval(intervalId);
    document.onkeydown = null;
    document.onkeyup = null;
    document.onkeypress = onKeyPressResult;
}

var onKeyPressResult = function(event) {
    enterInitState();
}

//======================================================================
// PlayingState
//======================================================================

var enterPlayingState = function() {
    document.onkeydown = onKeyDown;
    document.onkeyup = onKeyUp;
    document.onkeypress = null;
    intervalId = setInterval(draw, TIME_STEP * 1000);
    var canvas = document.getElementById('canvas');
    craft.x = canvas.width / 2;
    craft.y = craft.r;
    craft.vx = 0;
    craft.vy = 0;
    craft.a = 0;
    craft.fuel = 500;
    craft.engineOn = false;
    ground.x = canvas.width / 2;
    ground.y = canvas.height - 10;
    ground.width = canvas.width;
    ground.height = 20;
}

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
    ctx.fillStyle="rgb(193, 154, 107)"
    ctx.fillRect(ground.x - ground.width / 2,
                 ground.y - ground.height / 2,
                 ground.width, ground.height)
}

var drawCraft = function(ctx) {
    ctx.fillStyle="rgb(255, 255, 255)"
    ctx.save();
    ctx.translate(craft.x, craft.y);
    ctx.rotate(craft.a);
    var r = craft.r;

    // Ship
    ctx.beginPath();
    ctx.moveTo(-r, 0);
    ctx.lineTo(0, -r);
    ctx.lineTo(r, 0);
    ctx.arc(r/2, 0, r/2, 0, Math.PI/2, false);
    ctx.lineTo(-r/2, r/2);
    ctx.arc(-r/2, 0, r/2, Math.PI/2, Math.PI, false);
    ctx.closePath();
    ctx.fill();

    // Legs
    ctx.beginPath();
    ctx.moveTo(r/2, r/2);
    ctx.lineTo(r, r);
    ctx.moveTo(-r/2, r/2);
    ctx.lineTo(-r, r);
    ctx.stroke();


    if (craft.engineOn && craft.fuel > 0) {
        // Plume
        ctx.fillStyle="rgb(255, 255, 150)"
        ctx.beginPath();
        ctx.arc(0, 3*r/4, r/4, 0, 2*Math.PI);
        ctx.moveTo(r/4, 3*r/4);
        ctx.lineTo(0, 2*r);
        ctx.lineTo(-r/4, 3*r/4);
        ctx.fill();
    }
    ctx.restore();

    // ctx.save();

    // ctx.translate(0, 400);
    // ctx.scale(10, -10);
    // ctx.fillRect(0, 0, 10, 10);

    // ctx.scale(1, -1);
    // ctx.translate(0, -400);
    // ctx.fillRect(0, 0, 100, 100);

    // ctx.scale(10, -10);
    // ctx.translate(0, -40);
    // ctx.fillRect(0, 0, 10, 10);
    // ctx.restore();
}

var drawHud = function(ctx) {
    ctx.fillStyle="rgb(0, 0, 0)"
    var vyMessage = "VY: " + craft.vy.toFixed(1);
    ctx.fillText(vyMessage, 10, 10);
    var vxMessage = "VX: " + craft.vx.toFixed(1);
    ctx.fillText(vxMessage, 10, 30);
    var degMessage = "DEG: " + ((craft.a * 180) / Math.PI).toFixed(1);
    ctx.fillText(degMessage, 10, 50);
    var fuelMessage = "FUEL: " + craft.fuel;
    ctx.fillText(fuelMessage, 500, 10);
}

var draw = function() {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    // ctx.fillStyle="rgb(255, 255, 255)"
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawBackground(ctx);

    animate();
    drawCraft(ctx);
    drawGround(ctx);
    drawHud(ctx);

    if (craftCollide()) {
        if (craft.vy > MAX_VY 
            || Math.abs(craft.vx) > MAX_VX
            || (craft.a / (2 * Math.PI)) > 0.1) {
            drawTextCentered("CRASH!");
        } else {
            drawTextCentered("GOOD LANDING!");
        }
        enterResultState();
    }
    if (craft.x < 0 || craft.x > 600 || craft.y < 0) {
        drawTextCentered("OUT OF RANGE");
        enterResultState();
    }
}

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

//======================================================================
// Utils
//======================================================================

var drawTextCentered = function(text) {
    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var textSize = ctx.measureText(text);
    ctx.fillText(text, 
                 canvas.width / 2 - textSize.width / 2,
                 canvas.height / 2);
}

var drawBackground = function(ctx) {
    var gradient = ctx.createLinearGradient(0, 0, 0, 600);
    gradient.addColorStop(0, "rgb(0, 127, 255)");
    gradient.addColorStop(1, "rgb(204, 230, 230)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);

    ctx.fillStyle = "rgb(130, 102, 68)";
    ctx.beginPath();
    ctx.moveTo(0, 400);
    ctx.lineTo(0, 350);
    ctx.lineTo(100, 330);
    ctx.lineTo(500, 400);
    ctx.closePath();
    ctx.fill();
}