class testjson {
    constructor(mapData, playerData) {
        this.mapData = mapData;
        this.playerData = playerData;
    }
}
class testplayer {
    constructor(posX, posY, move, color, ranged) {
        this.x = posX;
        this.y = posY;
        this.canMove = 1;
        this.canAttack = 1;
        this.color = color;
        this.baseColor = color;
        this.skills = ["attack", "double attack", "poke"];
        switch (ranged) {
            case 0:
                this.attackRange = [
                    [ 0, 1, 0],
                    [ 1, 0, 1],
                    [ 0, 1, 0]];
                break;
            case 1:
                this.attackRange = [
                    [1, 1, 1],
                    [1, 0, 1],
                    [1, 1, 1]];
                break;
            case 2:
                this.attackRange = [
                    [0, 0, 1, 0, 0],
                    [0, 1, 0, 1, 0],
                    [1, 0, 0, 0, 1],
                    [0, 1, 0, 1, 0],
                    [0, 0, 1, 0, 0]];
                break;
        }
        this.moveRange = [
            [ 0, 0, 0, 1, 0, 0, 0],
            [ 0, 0, 1, 1, 1, 0, 0],
            [ 0, 1, 1, 1, 1, 1, 0],
            [ 1, 1, 1, 1, 1, 1, 1],
            [ 0, 1, 1, 1, 1, 1, 0],
            [ 0, 0, 1, 1, 1, 0, 0],
            [ 0, 0, 0, 1, 0, 0, 0]];
    }
}
class Menu {
    constructor(id, posX, posY, options) {
        this.x = posX;
        this.y = posY;
        this.id = id;
        this.width = 70;
        this.options = options;
        this.marginX = 4;
        this.marginY = 14;
        this.height = this.marginY * (options.length + 0.5);
    }

}

var mapData = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 0, 0, 1, 1, 1, 0], 
    [0, 1, 1, 1, 0, 0, 0, 0, 0, 0], 
    [0, 0, 1, 0, 0, 0, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 0, 1, 0, 1, 0], 
    [0, 0, 1, 0, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 0, 1, 0, 1, 0], 
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

var playerData = [
    new testplayer(1, 1, 4, "#ff0000", 0),
    new testplayer(5, 4, 5, "#00ffff", 1),
    new testplayer(3, 3, 5, "#0000ff", 2)
    ];

var canvas = null;
var ctx = null;

var tileWidth = 20;
var tileHeight = 20;

var mouseX;
var mouseY;

var units = [];
var activeUnit = -1;
var targetUnit = -1;

var menus = [];

window.onload = function() {

    var data = new testjson(mapData, playerData); 
    menus = [
   //     new Menu(-1, 50, 50, ["nothing", "blank"])
    ];

    canvas = document.getElementById('main-canvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    // canvas.addEventListener('mousemove', function(evt) {
    canvas.addEventListener('click', function(evt) {
        getMousePos(evt);
        var menu = getMenu();
        if (menu == -1) {
            handleAction();
        } else {
            handleMenu(menu);
        }
    }, false);
    ctx = canvas.getContext("2d");
    requestAnimationFrame(drawState);

}

window.onresize = function(event) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    requestAnimationFrame(drawState);
}

function handleMenu(menu) {
    var m = menus[menu];

    var index = Math.floor((mouseY - m.y) / m.marginY);
    if (index < 0)
        index = 0;
    if (index >= m.options.length)
        index = m.options.length - 1;

    console.log("menu index: " + menu + ", menu id: " + m.id + ", option: " + index);

    // TODO something here to grab selected index
    
    switch(m.id) {
        // next turn menu
        case 0:
            handleNextTurn();
            break;
        // action choice menu
        case 1:
            handleAttack(index);
            break;
    }
}

function handleNextTurn() {
    console.log("next turn");
    for (var i = 0; i < playerData.length; i++) {
        var p = playerData[i];
        p.canMove = 1;
        p.canAttack = 1;
    }
    closeMenus();
}

function handleAttack(index) {
    var p = playerData[activeUnit];
    console.log("attack selected: " + p.skills[index]);
    p.canAttack = 0;
    p.color = p.baseColor;
    activeUnit = -1;
    closeMenus();
}

function handleAction() {
    var tileX = Math.floor(mouseX/tileWidth);
    var tileY = Math.floor(mouseY/tileHeight);
    if (tileY >= mapData.length || tileX >= mapData[0].length)
        return;

    targetUnit = -1;

    for (var i = 0; i < playerData.length; i++) {
        var p = playerData[i];
        if (tileX == p.x && tileY == p.y) {
            targetUnit = i;
            break;
        }
    }

    var p = playerData[activeUnit];

    if (targetUnit == -1) {
        if (activeUnit == -1) {
            // mapData[mouseY][mouseX] = 2;
            if (menus.length == 0)
                menus[menus.length] = new Menu(0, mouseX, mouseY, ["next turn"])
            else 
                closeMenus();
        } else {
            if (canReach(p, p.moveRange, tileX, tileY) && p.canMove) {
                p.x = tileX;
                p.y = tileY;
                p.canMove = 0;
            }
            activeUnit = -1;
            p.color = p.baseColor
        }
    } else {
        closeMenus();
        if (activeUnit == -1) {
            activeUnit = targetUnit;
            p = playerData[activeUnit];
            p.color = "#00ff00";
        } else {
            if (canReach(p, p.attackRange, tileX, tileY) && p.canAttack) {
                menus[menus.length] = new Menu(1, mouseX, mouseY, p.skills); 
                p.canAttack = 0;
            }
        }
    }
    drawState();
    if (activeUnit != -1) {
        if (p.canMove)
            drawMove(playerData[activeUnit]);
        if (p.canAttack)
            drawAttack(playerData[activeUnit]);
    }
}

function drawState() {
    if (ctx==null) {
        return;
    }

    for (var x = 0; x < mapData.length; x++) {
        for (var y = 0; y < mapData[x].length; y++) {
            switch(mapData[y][x]) {
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
    drawMenus();
}

function drawMove(unit) {
    // redundant in standard call sequence
    if (ctx == null) {
        return;
    }

    var moves = unit.moveRange;
    var size = moves.length;
    var center = size/2 - 1;

    for (var y = 0; y < size; y ++) {
        var boardY = Math.floor(unit.y - center + y);
        if (boardY < 0)
            continue;
        for (var x = 0; x < size; x ++) {
            var boardX = Math.floor(unit.x - center + x);
            if (boardX < 0)
                continue;
            if (moves[x][y] == 1) {
                ctx.fillStyle = "#00ff00";
                ctx.fillRect(boardX*tileWidth + 8, boardY*tileHeight + 8, tileWidth - 16, tileHeight - 16);
            }
        }
    }
}

function drawAttack(unit) {
    if (ctx == null)
        return;

    var moves = unit.attackRange;
    var size = moves.length;
    var center = Math.floor(size/2);

    for (var y = 0; y < size; y++) {
        var boardY = unit.y - center + y;
        if (boardY < 0)
            continue;
        for (var x = 0; x < size; x++) {
            var boardX = unit.x - center + x;
            if (boardX < 0)
                continue;
            if (moves[x][y] == 1) {
                ctx.beginPath();
                ctx.arc((boardX + .5) * tileWidth, (boardY + .5) * tileHeight, tileWidth/2, 0, 2 * Math.PI);
                ctx.strokeStyle = "#ff0000";
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

function canReach(unit, range, xPos, yPos) {
    var size = Math.floor(range.length/2);
    if (xPos < unit.x - size || xPos > unit.x + size)
        return false;
    if (yPos < unit.y - size || yPos > unit.y + size)
        return false;
    var x = xPos + size - unit.x;
    var y = yPos + size - unit.y;
    if (range[x][y] == 1)
        return true;
    return false;
}

function drawUnits() {
    // redundant in standard call sequence
    if (ctx == null)   
        return;

    for (var i = 0; i < playerData.length; i++) {
        var p = playerData[i];
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x*tileWidth + 5, p.y*tileHeight + 5, tileWidth - 10, tileHeight - 10);
    }
}

function drawMenus() {
    // at this point, the reduntant in standard call sequence notice is redundant
    if (ctx == null)
        return;

    for (var i = 0; i < menus.length; i++) {
        var m = menus[i];
        ctx.fillStyle = "#cccccc";
        ctx.fillRect(m.x, m.y, m.width, m.height);

        for (var j = 0; j < m.options.length; j++) {
            var o = m.options[j];
            ctx.font = '10px serif';
            ctx.fillStyle = "#000000";
            ctx.fillText(o, m.x + m.marginX, m.y + m.marginY * (j + 1));
        }
    }
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    // no longer translating to map coordinate here to handle popup menus 
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
}

function getMenu() {
    // storing index instead of returning immediately to handle layering naturally, despite inefficiently
    var index = -1;
    for (var i = 0; i < menus.length; i++) {
        var m = menus[i];
        if (mouseX < m.x || mouseX > m.x + m.width)
            continue;
        if (mouseY < m.y || mouseY > m.y + m.height)
            continue;
        index = i;
    }
    return index;
}

function closeMenus() {
    menus = [];
    drawState();
}