
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
    def sample():
        g = tile.Types.GRASS
        w = tile.Types.WATER
        f = tile.Types.FOREST
        m = tile.Types.MOUNTAIN

        tilemap = [
            [m, g, g, g, g, g, g, g, g, g],
            [g, g, g, g, g, g, g, w, g, g],
            [g, g, g, w, g, g, g, w, f, g],
            [m, g, g, w, g, g, g, w, f, g],
            [g, g, w, w, w, g, g, g, g, f],
            [g, g, g, w, g, g, m, g, g, g],
            [m, f, g, w, g, f, g, g, g, g],
            [g, g, g, w, f, g, m, g, g, m],
            [g, f, g, g, g, g, g, g, m, g],
            [g, g, g, g, g, g, f, m, g, g],
        ]

        units = [
            unit.soldier(unit.Team.RED, [1, 0]),
            unit.soldier(unit.Team.BLUE, [3, 0]),

            unit.archer(unit.Team.RED, [0, 7]),
            unit.archer(unit.Team.BLUE, [1, 7]),
        ]
        state = State(tilemap, units)

        return state

    def __attrs_post_init__(self):
        self.update_units()

    def width(self):
        return len(self.tilemap[0])

    def height(self):
        return len(self.tilemap)

    def next_turn(self):
        for unit in self.units:
            unit.reset(self)

    def in_bounds(self, coord):
        if coord[1] < 0 or coord[1] >= self.height():
            return False

        if coord[0] < 0 or coord[0] >= self.width():
            return False

        return True

    def is_open(self, coord):
        if not self.in_bounds(coord):
            return False

        if self.get_unit(coord) != None:
            return False

        cur_tile = self.get_tile(coord)
        return cur_tile.cost != tile.IMPASSABLE

    def is_passable(self, coord):
        if not self.in_bounds(coord):
            return False

        cur_tile = self.get_tile(coord)
        return cur_tile.cost != tile.IMPASSABLE

    def get_tile(self, coord):
        if not self.in_bounds(coord):
            return None

        return tile.tiles[self.tilemap[coord[1]][coord[0]]]

    def get_unit(self, coord):
        if not self.in_bounds(coord):
            return None

        for unit in self.units:
            if unit.pos == coord:
                return unit

        return None

    def update_units(self):
        for unit in self.units:
            unit.update_moveable_tiles(self)
            unit.update_attackable_tiles(self)

    def json(self):
        jmap_width = len(self.tilemap[0])
        jmap_height = len(self.tilemap)

        jmap = [
            [tile_type.value for tile_type in row]
            for row in self.tilemap
        ]

        junits = [unit.json() for unit in self.units]

        return dict(
            width = jmap_width,
            height = jmap_height,
            map = jmap,
            units = junits,
        )
