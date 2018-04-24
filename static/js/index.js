
$(document).ready(function() {
    $('#create-game-modal').on('hidden.bs.modal', function(){
        $(this).find('form')[0].reset();
    });

    loadImages(function() {
        var socket = io.connect('http://' + document.domain + ':' + location.port);

        socket.on("init", function(state) {
            PlayerTeam = state.player_team;
            ActiveTeam = state.active_team;

            console.log(state);
            canvasInit(state);
        });

        socket.on("update", function(activeTeam, state) {
            ActiveTeam = activeTeam;

        });
    });
});
