
function onCreateGame() {
    $.post("/game", function(data) {
        alert(data)
    })
}

$(document).ready(function() {
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    socket.on("connect", function() {
        socket.emit("message", { data: "Dyalnana" })
    })

    $(".create-btn").click(onCreateGame)
})
