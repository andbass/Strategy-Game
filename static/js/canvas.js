
canvasInit = function(state) {
    canvas = $('#main-canvas').get(0);

    var width = state.width * TileSize;
    var height = state.height * TileSize;

    canvas.width = width;
    canvas.height = height;

    canvas.style.width = width + "px";
    canvas.style.height = height + "px";

    canvas.addEventListener('click', function(evt) {
        getMousePos(evt);
    }, false);

    ctx = canvas.getContext("2d");

    ctx.lineWidth = 3;

    requestAnimationFrame(function() {
        drawState(state);
    });
}

window.onresize = function(event) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    requestAnimationFrame(drawState);
}

function mapCoordToCanvas(coord) {
    return [coord[0] * TileSize, coord[1] * TileSize];
}

function drawState(state) {
    if (ctx == null) {
        return;
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawTiles(state);
    drawUnits(state);
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

        if (unit.hasMoved && unit.hasAttacked) {
            image = images.DONE;
        } else if (unit.hasMoved) {
            image = images.CAN_ATTACK;
        } else if (unit.hasAttacked) {
            image = images.CAN_MOVE;
        }

        image = filterImage(image, TeamColors[unit.team]);
        image.onload = function() {
            var coord = mapCoordToCanvas(unit.pos);
            ctx.drawImage(image, coord[0], coord[1], TileSize, TileSize);
        };
    });
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    // no longer translating to map coordinate here to handle popup menus 
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
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
