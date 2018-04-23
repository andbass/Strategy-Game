
$(document).ready(function() {
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    socket.on("connect", function() {
        socket.emit("message", { data: "Dyaln is cool" })
    })

    socket.on("update", function(state) {
        // Update the canvas with new game state
        // Redraw tilemap
        // Redraw units
    })

    $('#create-game-modal').on('hidden.bs.modal', function(){
        $(this).find('form')[0].reset();
    });
})
