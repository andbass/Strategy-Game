
function moveSelectedUnitTo(state, pos) {
    Sio.emit("move", {
        type: MoveTypes.CHANGE_POS,
        unit: state.units.indexOf(SelectedUnit),
        pos: pos,
    });
}

function drawMoveableTiles(unit, state) {
    ctx.fillStyle = "#0ff";

    unit.moveable_tiles.forEach(function(tile) {
        var coord = mapCoordToCanvas(tile);

        ctx.beginPath();            
        ctx.arc(
            coord[0] + TileSize / 2, 
            coord[1] + TileSize / 2, 
            TileSize / 4, 
            0, 2 * Math.PI);

        ctx.fill();
        ctx.stroke();
    });
}

function drawAttackableTiles(unit, state) {
    ctx.strokeStyle = "#f00";

    unit.attackable_tiles.forEach(function(tile) {
        var coord = mapCoordToCanvas(tile);

        ctx.beginPath();            
        ctx.arc(
            coord[0] + TileSize / 2, 
            coord[1] + TileSize / 2, 
            TileSize / 2, 
            0, 2 * Math.PI);

        ctx.stroke();
    });

    ctx.strokeStyle = "#000";
}


function drawHud(state) {
    if (Mode == Modes.NORMAL) return;

    if (Mode == Modes.MOVING) {
        drawMoveableTiles(SelectedUnit, state);
        drawAttackableTiles(SelectedUnit, state);
    }
}

