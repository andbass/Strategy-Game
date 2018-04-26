
var canvas;
var ctx;

function canvasInit(state) {
    canvas = $('#main-canvas').get(0);

    var width = state.width * TileSize;
    var height = state.height * TileSize;

    canvas.width = width;
    canvas.height = height;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    $(canvas).click(function(evt) {
        handleClick(evt, state, this);
    });

    ctx = canvas.getContext("2d");

    ctx.lineWidth = 3;
    ctx.font = StatsFontSize + "px monospace";

    requestAnimationFrame(function() {
        drawState(state);
    });
}

function canvasUpdate(state) {
    $(canvas).off("click");
    $(canvas).click(function(evt) {
        handleClick(evt, state, this);
    });

    requestAnimationFrame(function() {
        drawState(state);
    });
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();

    // no longer translating to map coordinate here to handle popup menus 
    var mouseX = evt.clientX - rect.left;
    var mouseY = evt.clientY - rect.top;

    return [mouseX, mouseY];
}

function getUnit(state, pos) {
    return state.units.find(function(unit) {
        return unit.pos[0] == pos[0] && unit.pos[1] == pos[1];
    });
}

function mapCoordToCanvas(coord) {
    return [coord[0] * TileSize, coord[1] * TileSize];
}

function canvasCoordToMap(coord) {
    return [
        Math.floor(coord[0] / TileSize), 
        Math.floor(coord[1] / TileSize)
    ];
}

function handleClick(evt, state, canvas) {
    evt.preventDefault();
    if (ActiveTeam !== PlayerTeam) {
        return;
    }

    var mousePos = getMousePos(evt);
    var mapPos = canvasCoordToMap(mousePos);

    var unit = getUnit(state, mapPos);
    if (Mode == Modes.MOVING) {
        var performedAction = handleMoveAction(state, mapPos);
        if (!performedAction) {
            handleAttackAction(state, mapPos);
        }

        Mode = Modes.NORMAL;
    } else if (Mode == Modes.ATTACKING) {
        handleAttackAction(state, mapPos);
        Mode = Modes.NORMAL;
    } else if (Mode == Modes.NORMAL) {
        if (unit !== undefined && unit.team == PlayerTeam) {
            if (!unit.has_moved) {
                Mode = Modes.MOVING;
                SelectedUnit = unit;
            } else if (!unit.has_attacked) {
                Mode = Modes.ATTACKING;
                SelectedUnit = unit;
            }
        } else {
            Mode = Modes.NORMAL;
            SelectedUnit = null;
        }
    }

    requestAnimationFrame(function() {
        drawState(state);
    });
}

function drawState(state) {
    if (ctx == null) {
        return;
    }

    drawUnits(state);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawTiles(state);
    drawUnits(state);

    drawHud(state);
}

function drawTiles(state) {
    for (var x = 0; x < state.width; x++) {
        for (var y = 0; y < state.height; y++) {
            coord = mapCoordToCanvas([x, y]);
            tile = state.map[y][x];

            ctx.fillStyle = TileColors[tile];
            ctx.fillRect(coord[0], coord[1], TileSize, TileSize);

            ctx.strokeStyle = "#000";
            ctx.strokeRect(coord[0], coord[1], TileSize, TileSize);
        }
    }
}

function drawUnits(state) {
    state.units.forEach(function(unit) {
        var images = UnitImages[unit.type];
        var image = images.CAN_BOTH;

        if (unit.has_moved && unit.has_attacked) {
            image = images.DONE;
        } else if (unit.has_moved) {
            image = images.CAN_ATTACK;
        } else if (unit.has_attacked) {
            image = images.CAN_MOVE;
        }

        image = filterImage(image, TeamColors[unit.team]);
        image.onload = function() {
            var coord = mapCoordToCanvas(unit.pos);
            ctx.drawImage(image, coord[0], coord[1], TileSize, TileSize);

            if (unit.hp == unit.max_hp) return;

            var bottomRight = [coord[0] + TileSize, coord[1] + TileSize];
            var textPos = [bottomRight[0] - StatsFontSize, bottomRight[1] - StatsFontSize];

            ctx.fillStyle = "#000";
            ctx.fillRect(textPos[0], textPos[1], StatsFontSize, StatsFontSize);

            ctx.fillStyle = "#fff";
            ctx.fillText(unit.hp, textPos[0], textPos[1] + StatsFontSize - 2);
        };
    });

    // Draw indicator of mode for unit
    if (Mode !== Modes.NORMAL) {
        var pos = SelectedUnit.pos;
        var coords = mapCoordToCanvas(pos);

        if (Mode === Modes.MOVING) {
            ctx.fillStyle = "#0ff";
        } else if (Mode === Modes.ATTACKING) {
            ctx.fillStyle = "#f00";
        }

        ctx.globalAlpha = 0.7;
        ctx.fillRect(coords[0], coords[1], TileSize, TileSize);
    }

    ctx.globalAlpha = 1.0;
}


function loadImages(complete) {
    var images = [
        {
            type: "DONE",
            src: "/static/sprites/soldier.png",
        }, {
            type: "CAN_BOTH",
            src: "/static/sprites/soldier_canBoth.png",
        }, {
            type: "CAN_ATTACK",
            src: "/static/sprites/soldier_canAttack.png",
        }, {
            type: "CAN_MOVE",
            src: "/static/sprites/soldier_canMove.png",
        }
    ];
    /*
    {
            type: "DONE",
            src: "/static/sprites/archer.png",
        }, {
            type: "CAN_BOTH",
            src: "/static/sprites/archer_canBoth.png",
        }, {
            type: "CAN_ATTACK",
            src: "/static/sprites/archer_canAttack.png",
        }, {
            type: "CAN_MOVE",
            src: "/static/sprites/archer_canMove.png",
        }
    ];
    */

    var imagesLoaded = 0;
    images.forEach(function(imageInfo) {
        var image = new Image();
        image.src = imageInfo.src;

        image.onload = function() {
            imagesLoaded++;
                UnitImages[UnitTypes.SOLDIER][imageInfo.type] = image;
                UnitImages[UnitTypes.ARCHER][imageInfo.type] = image;

            if (imagesLoaded == images.length) { // finished loading, can do stuff ;)
                complete();
            }
        }
    });
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
