class testjson {
    constructor(mapData, playerData) {
        this.mapData = mapData;
        this.playerData = playerData;
    }
}
class testplayer {
    constructor(posX, posY, move, color) {
        this.x = posX;
        this.y = posY;
        this.move = move;
        this.color = color;
        this.baseColor = color;
    }
}

var mapData = [
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 
    0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 
    0, 0, 1, 0, 0, 0, 1, 1, 1, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 
    0, 0, 1, 0, 0, 0, 1, 0, 1, 0,
    0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0
    ];

var playerData = [
    new testplayer(1, 1, 5, "#ff0000"),
    new testplayer(3, 3, 4, "#0000ff")
    ];

var legalMoves = [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0]
    ];
    

var canvas = null;
var ctx = null;
var mapWidth = 10;
var mapHeight = 10;

var tileWidth = 20;
var tileHeight = 20;

var mouseX;
var mouseY;

var units = [];
var activeUnit = -1;

window.onload = function() {

    var data = new testjson(mapData, playerData); 
    
    canvas = document.getElementById('main-canvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    // canvas.addEventListener('mousemove', function(evt) {
    canvas.addEventListener('click', function(evt) {
        getMousePos(evt);
        handleClick();
        console.log('mouse pos:' + mouseX + ', ' + mouseY);
    }, false);
    ctx = canvas.getContext("2d");
    requestAnimationFrame(drawState);

}

window.onresize = function(event) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    requestAnimationFrame(drawState);
}

function handleClick() {
    if (mouseY >= mapHeight || mouseX >= mapWidth)
        return;

    var targetUnit = -1;

    for (var i = 0; i < playerData.length; i++) {
        var p = playerData[i];
        if (mouseX == p.x && mouseY == p.y) {
            targetUnit = i;
            break;
        }
    }

    if (targetUnit == -1) {
        if (activeUnit == -1) {
            mapData[(mouseY*mapWidth) + mouseX] = 2;
        } else {
            var p = playerData[activeUnit];
            if (isLegal(p, legalMoves, mouseX, mouseY)) {
                p.x = mouseX;
                p.y = mouseY;
                p.color = p.baseColor;
                activeUnit = -1;
            }
        }
    } else {
        if (activeUnit == -1) {
            activeUnit = targetUnit;
            p.color = "#00ff00";
        } else {
            console.log("attack?");
        }
    }
    drawState();
    if (activeUnit != -1)
        drawLegal(playerData[activeUnit], legalMoves);
}

function drawState() {
    if (ctx==null) {
        return;
    }

    for (var y = 0; y < mapHeight; y++) {
        for (var x = 0; x < mapWidth; x++) {
            switch(mapData[((y * mapWidth) + x)]) {
                // replace case statements with tile data based on Type enum
                case 0:
                    ctx.fillStyle = "#000000";
                    break;
                case 1:
                    ctx.fillStyle = "#ccffcc";
                    break;
                case 2:
                    ctx.fillStyle = "#ff00ff";
                    break;
            }
            ctx.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);

        }
    }
    drawUnits();
}

function drawLegal(unit, moves) {
    // redundant in standard call sequence
    console.log("Drawing legal moves");
    if (ctx == null) {
        return;
    }
    
    var size = moves.length
    var center = size/2 - 1;

    console.log("unit length: " + size);
    for (var y = 0; y < size; y ++) {
        var boardY = Math.floor(unit.y - center + y);
        if (boardY >= 0) {
            for (var x = 0; x < size; x ++) {
                var boardX = Math.floor(unit.x - center + x);
                if (boardX >= 0) {
                    console.log("x " + x + ", y " + y);
                    if (moves[x][y] == 1) {
                        console.log("boardX: " + boardX + ", boardY " + boardY); 
                        ctx.fillStyle = "#00ff00";
                        ctx.fillRect(boardX*tileWidth + 8, boardY*tileHeight + 8, tileWidth - 16, tileHeight - 16);
                    }
                }
            }
        }
    }
}

function isLegal(unit, moves, xPos, yPos) {
    var size = Math.floor(moves.length/2);
    if (xPos < unit.x - size || xPos > unit.x + size)
        return false;
    if (yPos < unit.y - size || yPos > unit.y + size)
        return false;
    var x = xPos + size - unit.x;
    var y = yPos + size - unit.y;
    console.log("x: " + x + ", " + y );
    if (moves[x][y] == 1)
        return true;
    return false;
}

function drawUnits() {
    if (ctx==null) {    // redundant in standard call sequence
        return;
    }

    for (var i = 0; i < playerData.length; i++) {
        var p = playerData[i];
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x*tileWidth + 5, p.y*tileHeight + 5, tileWidth - 10, tileHeight - 10);
    }
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    mouseX = Math.floor((evt.clientX - rect.left)/tileWidth);
    mouseY = Math.floor((evt.clientY - rect.top)/tileHeight);
}




