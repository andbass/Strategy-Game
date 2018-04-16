class testjson {
    constructor(mapData, playerData) {
        this.mapData = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0], 
            [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0], 
            [0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 0], 
            [0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, 0],
            [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0], 
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]];

        this.playerData = [
            new testplayer("Bob", 1, 1, 4, "#ff0000", 0),
            new testplayer("Cob", 5, 4, 5, "#00ffff", 1),
            new testplayer("Dob", 3, 3, 5, "#0000ff", 2)
        ];
    }
}
class testplayer {
    constructor(name, posX, posY, move, color, ranged) {
        this.x = posX;
        this.y = posY;
        this.name = name;
        this.canMove = 1;
        this.canAttack = 1;
        this.color = color;
        this.baseColor = color;
        this.skills = ["Attack", "Quick Attack", "Poke"];
        this.hp = 20;
        this.str = 10;
        this.def = 5;
        switch (ranged) {
            case 0:
                this.attackRange = [
                    [ 0, 1, 0],
                    [ 1, 0, 1],
                    [ 0, 1, 0]];
                this.def = 10;
                break;
            case 1:
                this.attackRange = [
                    [1, 1, 1],
                    [1, 0, 1],
                    [1, 1, 1]];
                this.str = 15;
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

// all of the above should be grabbed from other files

class Menu {
    constructor(id, posX, posY, options) {
        this.x = posX;
        this.y = posY;
        this.id = id;
        this.options = options;
        this.marginX = 4;
        this.marginY = 14;
        this.height = this.marginY * (options.length + 0.5);
        var length = 0;
        for (var i = 0; i < options.length; i++) {
            if (options[i].length > length)
                length = options[i].length;
        }
        this.width = (length + 1) * (this.marginX + 1);
        if (this.width < 70)
            this.width = 70;
    }
}

var canvas = null;
var ctx = null;

var tileWidth = 20;
var tileHeight = 20;

var mouseX;
var mouseY;

var map = [];
var menus = [];
var units = [];

var activeUnit = -1;
var targetUnit = -1;
var attack = -1;

window.onload = function() {

    var data = new testjson(); 

    units = data.playerData;
    map = data.mapData;

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
            menus.splice(menu+1, menus.length-menu-1);
            handleAttack(index);
            break;
        case 2:
            handleConfirm();
            break;
    }
}

function handleNextTurn() {
    console.log("next turn");
    for (var i = 0; i < units.length; i++) {
        var p = units[i];
        p.canMove = 1;
        p.canAttack = 1;
    }
    closeMenus();
}

function handleAttack(index) {
    var p = units[activeUnit];
    attack = index;
    displayAttackStats();
}

// stat comparison
function displayAttackStats() {
    var xPos = menus[menus.length-1].x + menus[menus.length-1].width;
    var yPos = menus[menus.length-1].y;
    var p = units[activeUnit];
    var t = units[targetUnit];
    var player_text = [p.name + ": " + p.skills[attack], "  HP: " + p.hp, "  str: " + p.str, "  def: " + p.def];
    var target_text = [t.name + ": Counter", "  HP: " + t.hp, "  str: " + t.str, "  def: " + t.def];
    menus[menus.length] = new Menu(-1, xPos, yPos, player_text);
    menus[menus.length] = new Menu(-1, xPos + menus[menus.length-1].width, yPos, target_text);
    menus[menus.length] = new Menu(2, xPos, yPos + menus[menus.length-1].height, ["Confirm"]);
    drawState();    
}

// actually use selected action
function handleConfirm() {
    var p = units[activeUnit];
    var t = units[targetUnit];
    console.log("attack selected: " + p.skills[attack]);
    p.color = p.baseColor;
    p.canAttack = 0;
    // p.canMove = 0;   // adding this will prevent out of order actions, but its kinda fun to leave in, (maybe wrap it into a skill)
    activeUnit = -1;
    var damage = p.str - t.def;
    if (damage < 1)
        damage = 1;
    t.hp -= damage;
    if (t.hp <= 0)
        units.splice(targetUnit, 1);
    closeMenus();
    drawState();
}

function handleAction() {
    var tileX = Math.floor(mouseX/tileWidth);
    var tileY = Math.floor(mouseY/tileHeight);
    if (tileY >= map.length || tileX >= map[0].length)
        return;

    targetUnit = -1;

    for (var i = 0; i < units.length; i++) {
        var p = units[i];
        if (tileX == p.x && tileY == p.y) {
            targetUnit = i;
            break;
        }
    }

    var p = units[activeUnit];

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
            } else {
                activeUnit = -1;
                p.color = p.baseColor;
            }
            closeMenus();
        }
    } else {
        closeMenus();
        if (activeUnit == -1) {
            activeUnit = targetUnit;
            p = units[activeUnit];
            p.color = "#00ff00";
        } else {
            if (canReach(p, p.attackRange, tileX, tileY) && p.canAttack) {
                menus[menus.length] = new Menu(1, mouseX, mouseY, p.skills); 
            } else {
                activeUnit = -1;
                p.color = p.baseColor;
            }
        }
    }
    drawState();
    if (activeUnit != -1) {
        if (p.canMove)
            drawMove(units[activeUnit]);
        if (p.canAttack)
            drawAttack(units[activeUnit]);
    }
    drawMenus();
}

function drawState() {
    if (ctx==null) {
        return;
    }

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (var y = 0; y < map.length; y++) {
        for (var x = 0; x < map[y].length; x++) {
            switch(map[y][x]) {
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

    for (var i = 0; i < units.length; i++) {
        var p = units[i];
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
