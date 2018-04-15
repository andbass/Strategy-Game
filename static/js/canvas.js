var canvas = null
var ctx = null
var mapWidth = 5
var mapHeight = 5
var mapData = [
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    0, 1, 1, 1, 0,
    0, 1, 1, 1, 0,
    0, 0, 1, 0, 0
    ];

var tileWidth = 20;
var tileHeight = 20;

window.onload = function() {
    canvas = document.getElementById('main-canvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx = canvas.getContext("2d");
    requestAnimationFrame(drawState);
}

window.onresize = function(event) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    requestAnimationFrame(drawState);
}

function drawState() {
    if (ctx==null) {
        return;
    }
    /*
    var scaleFactor = canvas.width / canvas.height;
    var scaleWidth = tileWidth * scaleFactor;
    var scaleHeight = tileHeight * scaleFactor;

    console.log(scaleWidth);
    console.log(scaleHeight);
    */

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
            }
            ctx.fillRect(x*tileWidth, y*tileHeight, tileWidth, tileHeight);

        }
    }

}
