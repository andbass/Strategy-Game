
$(document).ready(function() {
    $('#create-game-modal').on('hidden.bs.modal', function(){
        $(this).find('form')[0].reset();
    });

    loadImages(function() {
        var socket = io.connect('http://' + document.domain + ':' + location.port);
        socket.on("connect", function() {

        });

        socket.on("update", function(state) {
            console.log(state);
            canvasInit(state);
        });
    });
});
