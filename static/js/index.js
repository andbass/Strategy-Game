var turnEnd = 0;
function vecEq(coord1, coord2) {
    return coord1[0] == coord2[0] && coord1[1] == coord2[1];
}

$(document).ready(function() {
    $('#create-game-modal').on('hidden.bs.modal', function(){
        $(this).find('form')[0].reset();
    });

    loadImages(function() {
        Sio = io.connect('http://' + document.domain + ':' + location.port);

        Sio.on("init", function(state) {
            PlayerTeam = state.player_team;
            ActiveTeam = state.active_team;

            console.log(state);
            canvasInit(state);
        });

        Sio.on("update", function(state) {
            Mode = Modes.NORMAL;

            console.log("UPDATE:");
            console.log(state);

            if (state.success === false) {
                alert("DIDNT WORK BOYO");
            }
    
            ActiveTeam = state.active_team;

            if (ActiveTeam === PlayerTeam) {
                $(".turn-header").text("Make your move!");
                console.log(turnEnd);
                if(turnEnd == 1) {
                    console.log("Notification");
                    if(window.Notification && Notification.permission !== "denied") {
                        Notification.requestPermission(function(status) {  // status is "granted", if accepted by user
                            var n = new Notification('Strategy', { 
                            body: 'It\'s your turn!',
                            }); 
                        });
                    }
                    turnEnd = 0;
                }   
            } else {
                turnEnd = 1;
                $(".turn-header").text("Please wait for other player...");
            }

            canvasUpdate(state);
        });

        Sio.on("destroy", function() {
            location.reload();
        });

        $(".end-turn-btn").click(function(evt) {
            Sio.emit("end-turn");
            turnEnd = 1;

        });

        $(".leave-btn").click(function(evt) {
            if (confirm("Are you sure?")) {
                Sio.emit("leave");
            }
        });
    });
});
