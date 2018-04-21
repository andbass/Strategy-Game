class testjson {
    constructor(mapData, playerData) {
        this.mapData = [
            [2, 2, 2, 1, 3, 2, 3, 3, 5, 0, 0, 1, 0, 0, 2],
            [2, 0, 3, 0, 5, 5, 0, 3, 5, 2, 1, 1, 1, 0, 2], 
            [3, 0, 0, 1, 5, 5, 0, 5, 5, 0, 0, 1, 2, 0, 2], 
            [3, 0, 0, 1, 5, 5, 0, 5, 5, 1, 1, 1, 1, 2, 2],
            [3, 0, 0, 1, 5, 5, 5, 5, 5, 0, 0, 1, 0, 2, 1], 
            [3, 0, 0, 0, 0, 1, 0, 0, 1, 2, 2, 0, 0, 2, 1],
            [3, 0, 0, 2, 1, 2, 0, 1, 1, 2, 2, 0, 1, 0, 1], 
            [3, 0, 2, 2, 2, 0, 1, 0, 3, 0, 0, 1, 1, 1, 3],
            [1, 0, 0, 2, 2, 0, 1, 0, 0, 0, 1, 1, 0, 3, 3], 
            [1, 3, 2, 2, 0, 2, 1, 2, 1, 2, 1, 0, 0, 3, 3]];

        this.playerData = [
            new testplayer("Bob", 3, 3, 0, 6),
            new testplayer("Cob", 6, 5, 1, 6),
            new testplayer("Dob", 10, 6, 2, 6),
            new testplayer("Fob", 11, 4, 3, 5),
            new testplayer("Gob", 11, 8, 4, 5)
        ];
    }
}
class testplayer {
    constructor(name, posX, posY, team, move) {
        this.x = posX;
        this.y = posY;
        this.team = team;
        this.name = name;
        this.move = move;
        this.canMove = 1;
        this.canAttack = 1;
        this.skills = [0, 1, 2];
        this.hp = 20;
        this.maxhp = 20;
        this.str = 10;
        this.def = 5;
        var images = [ 
            new Image(),
            new Image(),
            new Image(),
            new Image()
        ]
        images[0].src = "/static/sprites/soldier.png";
        images[1].src = "/static/sprites/soldier_canMove.png";
        images[2].src = "/static/sprites/soldier_canAttack.png";
        images[3].src = "/static/sprites/soldier_canBoth.png";
        switch (team) {
            case 0:
                this.skills[this.skills.length] = 4;
                this.skills[this.skills.length] = 8;
                break;
            case 1:
                this.skills[this.skills.length] = 3;
                this.skills[this.skills.length] = 5;
                break;
            case 2:
                this.skills[this.skills.length] = 6;
                break;
            case 3:
                this.skills[this.skills.length] = 7;
                break;
            case 4:
                this.skills[this.skills.length] = 4;
                break;
        }
        for (var i = 0; i < images.length; i++) {
            switch (team) {
                case 0:
                    images[i] = filterImage(images[i], [255, 0, 0]);
                    break;
                case 1:
                    images[i] = filterImage(images[i], [0, 255, 0]);
                    break;
                case 2:
                    images[i] = filterImage(images[i], [0, 0, 255]);
                    break;
                case 3:
                    images[i] = filterImage(images[i], [128, 128, 128]);
                    break;
                case 4:
                    images[i] = filterImage(images[i], [200, 200, 200]);
            }
        }
        this.imageSet = images;

        this.attackRange = function(self) {
            var range = [[0]];
            for (var i = 0; i < this.skills.length; i++) {
                var skill = actionSet[this.skills[i]].range(this);
                var diff = skill.length - range.length;
                var adjust = Math.floor(Math.abs(diff/2));
                if (diff > 0) {
                    for (var y = 0; y < range.length; y++) {
                        for (var x = 0; x < range.length; x++) {
                            if (range[x][y] == 1)
                                skill[x+adjust][y+adjust] = 1;
                        }
                    }
                    range = skill;
                } else {
                    for (var y = 0; y < skill.length; y++) {
                        for (var x = 0; x < skill.length; x++) {
                            if (skill[y][x] == 1)
                                range[x+adjust][y+adjust] = 1;
                        }
                    }
                }
            }
            return range;
        }


        this.moveRange = function(self) {
            console.log("here");
            var center = this.move;
            var size = this.move * 2 + 1;
            var grid = new Array(size);
            for (var y = 0; y < size; y++) {
                grid[y] = new Array(size);
            }

            var recurse = function(i, x, y, grid, unitX, unitY) {
                if (grid[y][x] >= i)
                    return;
                if (unitX + x < 0 || unitY + y < 0) {
                    grid[y][x] = 0;
                    return;
                }
                if (unitX + x > map[0].length || unitY + y >= map.length) {
                    grid[y][x] = 0;
                    return;
                }
                if (map[unitY + y][unitX + x] == 5) {
                    grid[y][x] = 0;
                    return;
                }
                grid[y][x] = i;
                if (map[unitY + y][unitX + x] == 2 || map[unitY + y][unitX + x] ==3) {
                    grid[y][x]--;
                    i--;   
                }
                i--;
                if (i > 0) {
                    recurse(i, x-1, y, grid, unitX, unitY);
                    recurse(i, x+1, y, grid, unitX, unitY);
                    recurse(i, x, y-1, grid, unitX, unitY);
                    recurse(i, x, y+1, grid, unitX, unitY);
                }
            };

            recurse(move, center, center, grid, this.x - center, this.y - center);

            for (var x = 0; x < size; x++) {
                for (var y = 0; y < size; y++) {
                    if (grid[x][y] > 0)
                        grid[x][y] = 1;
                }
            }


            return grid;
        }

        this.image = function() {
            if (this.canMove && this.canAttack)
                return this.imageSet[3];
            if (this.canAttack)
                return this.imageSet[2];
            if (this.canMove)
                return this.imageSet[1];
            return this.imageSet[0];
        }
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

class Bar {
    constructor(posX, posY, current, max) {
        this.ratio = current/max;
        this.x = posX + tileWidth/8;
        this.y = posY + tileWidth/4;
        this.width = tileWidth * 3/4;
        this.height = tileHeight/8;
    }
}

var canvas = null;
var ctx = null;

var tileWidth = 32;
var tileHeight = 32;

var mouseX;
var mouseY;

var map = [];
var menus = [];
var units = [];

var activeUnit = -1;
var targetUnit = -1;
var attack = -1;

window.onload = function() {
    // loadImages();
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

    switch(m.id) {
        // next turn menu
        case 0:
            handleNextTurn();
            break;
        // action choice menu
        case 1:
            menus.splice(menu+1, menus.length-menu-1);
            attack = index;
            displayAttackStats();
            break;
        case 2:
            handleConfirm();
            break;
    }
}

function handleNextTurn() {
    for (var i = 0; i < units.length; i++) {
        var p = units[i];
        p.canMove = 1;
        p.canAttack = 1;
    }
    closeMenus();
}

// stat comparison
function displayAttackStats() {
    var xPos = menus[menus.length-1].x + menus[menus.length-1].width;
    var yPos = menus[menus.length-1].y;
    var p = units[activeUnit];
    var t = units[targetUnit];
    var action = actionSet[p.skills[attack]];
    var player_text;
    var inRange = canReach(p, action.range(p), t.x, t.y);
    if (inRange) {
        player_text = [p.name + ": " + action.name, 
            "  HP: " + p.hp, 
            "  str: " + p.str, 
            action.info(p, t)];
    } else {
        player_text = [p.name + ": " + action.name,
            "  not in range"
            ];
    }
    var target_text = [t.name + ": Counter", 
        "  HP: " + t.hp, 
        "  str: " + t.str, 
        "  def: " + t.def];
    menus[menus.length] = new Menu(-1, xPos, yPos, player_text);
    menus[menus.length] = new Menu(-1, xPos + menus[menus.length-1].width, yPos, target_text);
    if (inRange)
        menus[menus.length] = new Menu(2, xPos, yPos + menus[menus.length-1].height, ["Confirm"]);
    drawState();    
}

// actually use selected action
function handleConfirm() {
    var p = units[activeUnit];
    var t = units[targetUnit];
    p.color = p.baseColor;
    p.canAttack = 0;
    // p.canMove = 0;   // adding this will prevent out of order actions, but its kinda fun to leave in, (maybe wrap it into a skill)
    activeUnit = -1;

    var action = actionSet[p.skills[attack]];
    if (action.pre != null)
        action.pre(p, t);

    var damage = action.damage(p, t);
    t.hp -= damage;
    if (t.hp <= 0)
        units.splice(targetUnit, 1);
    if (t.hp > t.maxhp)
        t.hp = t.maxhp;
    
    if (action.post != null)
        action.post(p, t);

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
            if (canReach(p, p.moveRange(), tileX, tileY) && p.canMove) {
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
            if (canReach(p, p.attackRange(), tileX, tileY) && p.canAttack) {
                var s = [];
                for (var i = 0; i < p.skills.length; i++) {
                    s[s.length] = actionSet[p.skills[i]].name;
                    var range = actionSet[p.skills[i]].range(p);
                    if (!canReach(p, range, tileX, tileY)) {
                            s[s.length-1] += " X"; 
                    }
                }
                menus[menus.length] = new Menu(1, mouseX, mouseY, s); 
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
                case 0: // Grass
                    ctx.fillStyle = "rgb(130, 400, 0)";
                    break;
                case 1: // Dirt
                    ctx.fillStyle = "#513500";
                    break;
                case 2: // Forest
                    ctx.fillStyle = "#105000";
                    break;
                case 3: // Mountain
                    ctx.fillStyle = "#ffae00";
                    break
                case 5: // Water
                    ctx.fillStyle = "rgb(35, 163, 252)";
                    break;

            }
            ctx.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);

            ctx.strokeStyle = "#000";
            ctx.lineWidth = 1; 
            ctx.strokeRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);
        }
    }
    drawUnits();
    drawBars();
    drawMenus();
    
    // testing
//    console.log("should draw image");
//    ctx.drawImage(image, 40, 40);
}

function drawMove(unit) {
    // redundant in standard call sequence
    if (ctx == null) {
        return;
    }

    var moves = unit.moveRange();
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
            if (moves[y][x] == 1) {
                ctx.beginPath();
                ctx.arc((boardX + .5) * tileWidth, (boardY + .5) * tileHeight, tileWidth/8, 0, 2 * Math.PI);
                ctx.fillStyle = "#22f"
                ctx.fill();


                ctx.strokeStyle = "#000";
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

function drawAttack(unit) {
    if (ctx == null)
        return;

    var moves = unit.attackRange();
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
            if (moves[y][x] == 1) {
                ctx.beginPath();
                ctx.arc((boardX + .5) * tileWidth, (boardY + .5) * tileHeight, tileWidth/3, 0, 2 * Math.PI);
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
    if (range[y][x] == 1)
        return true;
    return false;
}

function drawUnits() {
    // redundant in standard call sequence
    if (ctx == null)   
        return;

    for (var i = 0; i < units.length; i++) {
        var p = units[i];
/*
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x*tileWidth + 5, p.y*tileHeight + 5, tileWidth - 10, tileHeight - 10);
*/
 
        ctx.drawImage(p.image(), p.x * tileWidth, p.y * tileWidth);
        if (p.canMove && p.canAttack)
            ctx.strokeStyle = "#0000ff";
        else if (p.canMove)
            ctx.strokeStyle = "#00ff00";
        else if (p.canAttack)
            ctx.strokeStyle = "#ff0000";
        if (p.canMove || p.canAttack) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.arc((p.x + .5) * tileWidth, (p.y + .5) * tileHeight, tileWidth/2, 0, 2 * Math.PI);
            ctx.stroke();
        }
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

function drawBars() {
    if (ctx == null)
        return;
    for (var i = 0; i < units.length; i++) {
        var p = units[i];
        var bar = new Bar(p.x * tileWidth, p.y * tileHeight - 10, p.hp, p.maxhp);
        ctx.fillStyle = "#666666";
        ctx.fillRect(bar.x, bar.y, bar.width, bar.height);
        if (bar.ratio > 0.5)
            ctx.fillStyle = "#00ff00";
        else
            ctx.fillStyle = "#ff0000";
        ctx.fillRect(bar.x, bar.y, bar.width*bar.ratio, bar.height);

        ctx.strokeStyle = "#000";
        ctx.lineWidth = 1;        
        ctx.strokeRect(bar.x, bar.y, bar.width*bar.ratio, bar.height);
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

function loadImages() {

    console.log("got here");
    var images = [
        "/static/sprites/soldier.png",
        "/static/sprites/soldier_canBoth.png",
        "/static/sprites/soldier_canAttack.png",
        "/static/sprites/soldier_canMove.png"];
    console.log("have " + images.length + " images to process");
    for (var i = 0; i < images.length; i++) {
        var image = new Image();
        image.src = images[i];
        document.documentElement.appendChild(image);
        // image.src = images[i];
    }
}

function filterImage(image, color) {
    var fakeCanvas = document.createElement('canvas');
    var ctx = fakeCanvas.getContext('2d');
    fakeCanvas.width = 32;
    fakeCanvas.height = 32;

    ctx.drawImage(image,0,0);
    var imageData = ctx.getImageData(0,0,32,32);
    var data = imageData.data;

    // filtering the purple RGB = 87, 0, 127 to be source color
    for (var y = 0; y < 32; y++) {
        for (var x = 0; x < 32; x++) {
            var index = (x + 32 * y) * 4;
            if (data[index+0] == 87 && data[index+1] == 0 && data[index+2] == 127) {        
                data[index+0] = color[0];
                data[index+1] = color[1];
                data[index+2] = color[2];
                // alpha is optional
                if (color.length > 3) {
                    data[index+4] = color[3];
                }
            }
        }
    }
    ctx.putImageData(imageData, 0, 0);
    var trans = new Image();
    trans.src = fakeCanvas.toDataURL();
    return trans;

}
