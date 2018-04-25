
function moveSelectedUnitTo(state, pos) {
    SelectedUnit.pos = pos;
    requestAnimationFrame(function() {
        drawState(state);
    });

    Sio.emit("move", {
        type: MoveTypes.CHANGE_POS,
        unit: state.units.indexOf(SelectedUnit),
        pos: pos,
    });
}

function attackWithSelectedUnit(state, target) {
    Sio.emit("move", {
        type: MoveTypes.ATTACK,
        unit: state.units.indexOf(SelectedUnit),
        target: state.units.indexOf(target),
    });
}

function handleMoveAction(state, mapPos) {
    var tile = SelectedUnit.moveable_tiles.find(function(tile) {
        return vecEq(tile, mapPos);
    });

    if (tile !== undefined) {
        moveSelectedUnitTo(state, tile);
        return true;
    }

    return false;
}

function handleAttackAction(state, mapPos) {
    var tile = SelectedUnit.attackable_tiles.find(function(tile) {
        return vecEq(tile, mapPos);
    });

    if (tile !== undefined) {
        var target = getUnit(state, tile);
        if (target !== undefined) {
            attackWithSelectedUnit(state, target);
        }
    }
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
    unit.attackable_tiles.forEach(function(tile) {
        var coord = mapCoordToCanvas(tile);
        var target = getUnit(state, tile);

        if (target !== undefined && target.team != PlayerTeam) {
            ctx.globalAlpha = 1.0;
            ctx.strokeStyle = "#f00";
        } else {
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = "#c00";
        }

        ctx.beginPath();            
        ctx.arc(
            coord[0] + TileSize / 2, 
            coord[1] + TileSize / 2, 
            TileSize / 2, 
            0, 2 * Math.PI);

        ctx.stroke();
    });

    ctx.globalAlpha = 1.0;
    ctx.strokeStyle = "#000";
}


function drawHud(state) {
    if (Mode == Modes.NORMAL) return;

    if (Mode == Modes.MOVING) {
        drawMoveableTiles(SelectedUnit, state);
        drawAttackableTiles(SelectedUnit, state);
    } else if (Mode == Modes.ATTACKING) {
        drawAttackableTiles(SelectedUnit, state);
    }
}

