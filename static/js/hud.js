
function drawHud(state) {
    if (Mode == Modes.NORMAL) return;

    if (Mode == Modes.MOVING) {
        ctx.fillStyle = "#0ff";

        SelectedUnit.moveable_tiles.forEach(function(tile) {
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
}

