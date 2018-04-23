canvasInit = function() {
    canvas = document.getElementById('main-canvas');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // canvas.addEventListener('mousemove', function(evt) {
    canvas.addEventListener('click', function(evt) {
        getMousePos(evt);
    }, false);

    ctx = canvas.getContext("2d");
    requestAnimationFrame(drawState);
}

window.onresize = function(event) {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    requestAnimationFrame(drawState);
}

function drawState() {
    if (ctx == null) {
        return;
    }

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function getMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    // no longer translating to map coordinate here to handle popup menus 
    mouseX = evt.clientX - rect.left;
    mouseY = evt.clientY - rect.top;
}

function loadImages(complete) {
    var images = [
        "/static/sprites/soldier.png",
        "/static/sprites/soldier_canBoth.png",
        "/static/sprites/soldier_canAttack.png",
        "/static/sprites/soldier_canMove.png"
    ];

    var imagesLoaded = 0;
    for (var i = 0; i < images.length; i++) {
        var image = new Image();
        image.src = images[i];

        image.onload = function() {
            imagesLoaded++;

            if (imagesLoaded == images.length) { // finished loading, can do stuff ;)
                canvasInit();
                complete();
            }
        }
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
