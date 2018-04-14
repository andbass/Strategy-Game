
function onCreateGame(evt) {
    evt.preventDefault()

    var data = $("#create-game-modal form").serialize()
    $.post("/game", data, function(data) {
        alert(JSON.stringify(data))
    })
}

$(document).ready(function() {
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    socket.on("connect", function() {
        socket.emit("message", { data: "Dyalnana" })
    })

    $('#create-game-modal').on('hidden.bs.modal', function(){
        $(this).find('form')[0].reset();
    });

    $(".create-btn").click(onCreateGame)
})
