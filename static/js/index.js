
function onCreateGame(evt) {
    var self = this;

    evt.preventDefault()
    var data = $("#create-game-modal form").serialize()

    $(self).attr("disabled", true)
    $.post("/game", data, function(data) {
        $(self).removeAttr("disabled")
        $("#create-game-modal").modal("hide")
    })
}

$(document).ready(function() {
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    socket.on("connect", function() {
        socket.emit("message", { data: "Dyaln is cool" })
    })

    $('#create-game-modal').on('hidden.bs.modal', function(){
        $(this).find('form')[0].reset();
    });

    $(".create-btn").click(onCreateGame)
    $(".login-btn").click(onLogin)
})
