
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

            $.contextMenu({
                selector: "#main-canvas",
                trigger: "left",
                items: {
                    move: {
                        name: "Move",
                        callback: function(key, opt) {
                            console.log(opt);
                        }
                    }
                },
            });
        });

        socket.on("update", function(activeTeam, state) {
            ActiveTeam = activeTeam;

            drawState(state);
            hudUpdate(state);
        });
    });
});
