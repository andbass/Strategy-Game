
import attr

import tile
import unit

from db import db, Game

@attr.s
class State:
    tilemap = attr.ib()
    units = attr.ib(default=attr.Factory(list))

    @staticmethod
    def current(game_id):
        game = Game.query.get(game_id)
        return game.state

    @staticmethod
    def update(game_id, new_state):
        game = Game.query.get(game_id)
        game.state = new_state
       
        db.session.commit()

    @staticmethod
    def sample():
        g = tile.grass
        w = tile.water
        f = tile.forest
        m = tile.mountain

        tilemap = [
            [m(), g(), g(), g(), g(), g(), g(), g(), g(), g()],
            [g(), g(), g(), g(), g(), g(), g(), w(), g(), g()],
            [g(), g(), g(), w(), g(), g(), g(), w(), f(), g()],
            [m(), g(), g(), w(), g(), g(), g(), w(), f(), g()],
            [g(), g(), w(), w(), w(), g(), g(), g(), g(), f()],
            [g(), g(), g(), w(), g(), g(), m(), g(), g(), g()],
            [m(), f(), g(), w(), g(), f(), g(), g(), g(), g()],
            [g(), g(), g(), w(), f(), g(), m(), g(), g(), m()],
            [g(), f(), g(), g(), g(), g(), g(), g(), m(), g()],
            [g(), g(), g(), g(), g(), g(), f(), m(), g(), g()],
        ]

        units = [unit.soldier(unit.Team.RED, [1, 0]), unit.soldier(unit.Team.BLUE, [3, 0])]

        return State(tilemap, units)

    def moveable_tiles(self, unit):
        pass
