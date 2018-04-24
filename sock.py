
from flask_socketio import SocketIO, send, emit, join_room, leave_room

from state import State
from auth import current_user
from db import Game

import enum

sio = SocketIO()

class MoveType(enum.Enum):
    CHANGE_POS = 0
    ATTACK = 1

@sio.on("connect")
def connect():
    if not current_user.is_authenticated:
        return dict(message="login")

    game = current_user.get_game()
    if game is None:
        return

    state = game.state

    join_room(game.id)

    json = game.state.json()
    json.update(dict(
        player_team=current_user.get_team(),
        active_team=game.active_team,
    ))

    sio.emit("init", json)

@sio.on("disconnect")
def disconnect():
    pass

@sio.on("move")
def move(req):
    if not current_user.is_authenticated:
        return dict(message="login")

    if not current_user.is_active():
        return dict(message="wait")

    game = current_user.get_game()

    if game.current_player != current_user:
        return dict(message="not-turn")

    unit_idx = req["unit"]

    state = State.current()
    unit = state.units[unit_idx]

    move_type = MoveType(req["type"])

    if move_type == MoveType.CHANGE_POS:
        unit.move_to(req["pos"], state)
    elif move_type == MoveType.ATTACK:
        target_idx = req["target"]
        unit.attack_unit(target_idx, state)

    State.update(state)

    json = game.state.json()
    json.update(dict(
        active_team=game.active_team,
    ))

    sio.emit("update", json, room=game.id)

@sio.on("end-turn")
def end_turn(req):
    pass
