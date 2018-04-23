
from flask_socketio import SocketIO, send, emit, join_room, leave_room

from state import State
from auth import current_user
from db import Game

import enum

sio = SocketIO()

def base_info(req):
    return req["game_id"]

class MoveType(enum.Enum):
    CHANGE_POS = 0
    ATTACK = 1

@sio.on("connect")
def connect():
    pass

@sio.on("disconnect")
def disconnect():
    pass

@sio.on("move")
def move(req):
    if not current_user.is_authenticated:
        return dict(message="login")

    game_id = base_info(req)
    game = Game.query.get(game_id)

    if game.current_player != current_user:
        return dict(message="not-turn")

    unit_idx = req["unit"]

    state = State.current()
    unit = state.units[unit_idx]

    move_type = MoveType(req["type"])

    if move_type == MoveType.CHANGE_POS:
        unit.move_to(req["pos"], state)
    elif move_type == MoveType.ATTACK:
        target = state.units[req["target"]]
        unit.attack(target_idx, target, state)

    State.update(state)

@sio.on("end-turn")
def end_turn(req):
    pass
