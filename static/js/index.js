
$(document).ready(function() {
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    socket.on("connect", function() {
        socket.emit("message", { data: "Dyaln is cool" })
    })

    $('#create-game-modal').on('hidden.bs.modal', function(){
        $(this).find('form')[0].reset();
    });
})
